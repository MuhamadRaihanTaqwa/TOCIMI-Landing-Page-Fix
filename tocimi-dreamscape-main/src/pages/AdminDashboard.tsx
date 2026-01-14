import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';
import { Edit, Trash2, Plus, LogOut } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
  isNew: boolean;
  tags?: string[];
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

const AdminDashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const debug = new URLSearchParams(location.search).get('debug') === '1';
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Tas']);
  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Tas',
    isNewCategory: false,
    newCategoryName: '',
    imageFile: null as File | null,
    isNew: false,
    tags: '', // comma separated list
  });

  // Image preview and upload progress
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5,
    avatar: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target as HTMLInputElement;

    // Checkbox handling
    if (type === 'checkbox') {
      const checked = (target as HTMLInputElement).checked;
      setFormData(prev => {
        const newData = { ...prev, [name]: checked } as typeof prev;

        // If unchecking new category, reset category to Tas
        if (name === 'isNewCategory' && !checked) {
          newData.category = 'Tas';
          newData.newCategoryName = '';
        }
        return newData;
      });
      return;
    }

    // File input handling
    if (type === 'file') {
      const files = (target as HTMLInputElement).files;
      const file = files && files[0] ? files[0] : null;
      setFormData(prev => ({ ...prev, imageFile: file }));
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        setImageRemoved(false);
      } else {
        setImagePreview(null);
      }
      return;
    }

    // Text/select/textarea handling
    setFormData(prev => {
      const newData = { ...prev, [name]: value } as typeof prev;

      // Auto-set category based on newCategoryName
      if (name === 'newCategoryName' && value.trim()) {
        newData.category = value.trim();
      }

      return newData;
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return await new Promise<string>((resolve, reject) => {
      // set a timeout to cancel stalled uploads
      let timeoutHandle: ReturnType<typeof setTimeout> | null = setTimeout(() => {
        console.error('Upload timed out (no progress) — cancelling');
        try { uploadTask.cancel(); } catch (e) { /* ignore */ }
        setUploadProgress(null);
        reject(new Error('Upload timed out'));
      }, 45000); // 45s without progress = fail

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log('upload progress', progress, snapshot.state);
          setUploadProgress(progress);

          // reset timeout whenever we get progress
          if (timeoutHandle) {
            clearTimeout(timeoutHandle);
          }
          timeoutHandle = setTimeout(() => {
            console.error('Upload stalled — cancelling');
            try { uploadTask.cancel(); } catch (e) { /* ignore */ }
            setUploadProgress(null);
            reject(new Error('Upload stalled'));
          }, 30000);
        },
        (error) => {
          if (timeoutHandle) clearTimeout(timeoutHandle);
          setUploadProgress(null);
          console.error('upload failed', error);
          reject(error);
        },
        async () => {
          if (timeoutHandle) clearTimeout(timeoutHandle);
          setUploadProgress(null);
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('upload complete', url);
            resolve(url);
          } catch (err) {
            console.error('getDownloadURL failed', err);
            reject(err);
          }
        },
      );
    });
  }; 

  // Validate price starts with "Rp."
  const validatePrice = (price: string) => {
    return price.startsWith('Rp.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate price format
    if (!validatePrice(formData.price)) {
      toast.error('Harga harus dimulai dengan "Rp."');
      return;
    }

    // Validate new category name if checkbox is checked
    if (formData.isNewCategory && !formData.newCategoryName.trim()) {
      toast.error('Nama kategori baru harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = editingProduct?.image || '';

      // Upload image if provided
      if (formData.imageFile) {
        console.log('Uploading image...', formData.imageFile.name);
        setUploadProgress(0);
        try {
          imageUrl = await uploadImage(formData.imageFile);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setLastError((uploadError as Error)?.message ?? 'Upload failed');
          toast.error('Upload gambar gagal, namun produk akan disimpan tanpa gambar');
          // Continue without image
        }
      } else if (imageRemoved) {
        // Admin explicitly removed image while editing
        imageUrl = '';
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: formData.price,
        description: `Produk ${formData.name} kategori ${formData.category}`,
        image: imageUrl,
        isNew: formData.isNew,
        tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
      };

      console.log('Saving product data:', productData);

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        toast.success('Produk berhasil diperbarui');
      } else {
        await addDoc(collection(db, 'products'), productData);
        toast.success('Produk berhasil ditambahkan');
      }

      // Reset form
      setFormData({
        name: '',
        price: '',
        category: 'Tas',
        isNewCategory: false,
        newCategoryName: '',
        imageFile: null,
        isNew: false,
        tags: '',
      });

      // Reset file input and preview/progress
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      setImagePreview(null);
      setUploadProgress(null);
      setImageRemoved(false);

      setEditingProduct(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Submit error:', error);
      setLastError((error as Error).message);
      toast.error('Terjadi kesalahan: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Testimonials handlers ---
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Testimonial[];
      setTestimonials(data);
    });

    return unsubscribe;
  }, []);

  const handleTestimonialInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setTestimonialForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'testimonials'), {
        name: testimonialForm.name,
        role: testimonialForm.role,
        content: testimonialForm.content,
        rating: Number(testimonialForm.rating),
        avatar: testimonialForm.avatar,
      });
      toast.success('Testimoni ditambahkan');
      setTestimonialForm({ name: '', role: '', content: '', rating: 5, avatar: '' });
      setIsTestimonialDialogOpen(false);
    } catch (error) {
      console.error('Add testimonial error:', error);
      setLastError((error as Error).message);
      toast.error('Gagal menambahkan testimoni');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Yakin hapus testimoni ini?')) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      toast.success('Testimoni dihapus');
    } catch (error) {
      toast.error('Gagal menghapus testimoni');
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }

    // Real-time listener for products
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Product, 'id'>)
      })) as Product[];
      setProducts(productsData);
      // compute unique categories
      const uniqueCategories = Array.from(new Set(productsData.map(p => p.category).filter(Boolean)));
      setCategories(['Tas', ...uniqueCategories.filter(c => c !== 'Tas')]);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, isAdmin, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      isNewCategory: product.category !== 'Tas',
      newCategoryName: product.category !== 'Tas' ? product.category : '',
      imageFile: null,
      isNew: product.isNew,
      tags: product.tags ? product.tags.join(', ') : '',
    });
    setImagePreview(product.image || null);
    setImageRemoved(false);
    setIsDialogOpen(true);
  }; 

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        toast.success('Produk berhasil dihapus');
      } catch (error) {
        toast.error('Terjadi kesalahan');
      }
    }
  };



  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: 'Tas',
      isNewCategory: false,
      newCategoryName: '',
      imageFile: null,
      isNew: false,
      tags: '',
    });
    setImagePreview(null);
    setImageRemoved(false);
    setUploadProgress(null);
    setIsDialogOpen(true);
  }; 

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {debug && (
        <div className="fixed left-4 top-4 z-50 bg-black/80 text-white p-3 rounded shadow-lg text-sm w-80">
          <div className="font-semibold mb-2">Debug (query ?debug=1)</div>
          <div><strong>user:</strong> {user ? '' : 'null'}</div>
          <div><strong>isAdmin:</strong> {String(isAdmin)}</div>
          <div><strong>loading:</strong> {String(loading)}</div>
          <div><strong>products:</strong> {products.length}</div>
          <div><strong>testimonials:</strong> {testimonials.length}</div>
          {lastError && <div className="mt-2 text-xs text-red-300">Error: {lastError}</div>}
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Kelola produk TOCIMI</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Produk</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Produk Baru</p>
                    <p className="text-2xl font-bold">{products.filter(p => p.isNew).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Daftar Produk</CardTitle>
                  <CardDescription>Kelola semua produk</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={openAddDialog}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Produk
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
                        <DialogDescription>
                          {editingProduct ? 'Perbarui informasi produk' : 'Tambahkan produk baru ke katalog'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nama Produk</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Masukkan nama produk"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Harga (harus dimulai dengan "Rp.")</Label>
                          <Input
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Rp. 50.000"
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="isNewCategory"
                              name="isNewCategory"
                              checked={formData.isNewCategory}
                              onChange={handleInputChange}
                            />
                            <Label htmlFor="isNewCategory">Kategori baru selain Tas?</Label>
                          </div>

                          {!formData.isNewCategory ? (
                            <div>
                              <Label htmlFor="category">Pilih Kategori</Label>
                              <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="block w-full border border-input rounded px-3 py-2">
                                {categories.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div>
                              <Label htmlFor="newCategoryName">Nama Kategori Baru</Label>
                              <Input
                                id="newCategoryName"
                                name="newCategoryName"
                                value={formData.newCategoryName}
                                onChange={handleInputChange}
                                placeholder="Masukkan nama kategori baru"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="tags">Tags / Hastag (pisahkan dengan koma)</Label>
                          <Input
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="contoh: #baru, #diskon"
                          />
                        </div>
                        <div>
                          <Label htmlFor="image">Foto Produk (opsional)</Label>
                          <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleInputChange}
                          />

                          {imagePreview && (
                            <div className="mt-3">
                              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
                              <div className="flex gap-2 mt-2">
                                <Button type="button" variant="outline" onClick={() => { setImagePreview(null); setFormData(prev => ({ ...prev, imageFile: null })); setImageRemoved(true); }}>
                                  Remove Image
                                </Button>
                                <Button type="button" onClick={() => { if (imagePreview && !formData.imageFile && editingProduct) { window.open(imagePreview, '_blank'); } }}>
                                  View Full
                                </Button>
                              </div>
                            </div>
                          )}

                          {uploadProgress !== null && (
                            <div className="mt-3">
                              <div className="h-2 bg-muted rounded overflow-hidden">
                                <div className="h-2 bg-primary" style={{ width: `${uploadProgress}%` }} />
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{uploadProgress}%</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isNew"
                            name="isNew"
                            checked={formData.isNew}
                            onChange={handleInputChange}
                          />
                          <Label htmlFor="isNew">Produk Baru</Label>
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? 'Menyimpan...' : (editingProduct ? 'Perbarui' : 'Tambah') + ' Produk'}
                        </Button>

                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Gambar</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-20 h-12 object-cover rounded" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{product.tags?.join(', ')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Testimonials Management */}
            <div className="mt-6">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Testimonials</CardTitle>
                    <CardDescription>Kelola testimoni pelanggan</CardDescription>
                  </div>
                  <div>
                    <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={() => setIsTestimonialDialogOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Testimoni
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Tambah Testimoni</DialogTitle>
                          <DialogDescription>Tambahkan testimoni pelanggan</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddTestimonial} className="space-y-4">
                          <div>
                            <Label htmlFor="t-name">Nama</Label>
                            <Input id="t-name" name="name" value={testimonialForm.name} onChange={handleTestimonialInput} required />
                          </div>
                          <div>
                            <Label htmlFor="t-role">Peran</Label>
                            <Input id="t-role" name="role" value={testimonialForm.role} onChange={handleTestimonialInput} required />
                          </div>
                          <div>
                            <Label htmlFor="t-content">Isi</Label>
                            <Textarea id="t-content" name="content" value={testimonialForm.content} onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))} required />
                          </div>
                          <div>
                            <Label htmlFor="t-rating">Rating (1-5)</Label>
                            <Input id="t-rating" name="rating" type="number" min={1} max={5} value={testimonialForm.rating} onChange={(e) => setTestimonialForm(prev => ({ ...prev, rating: Number(e.target.value) }))} required />
                          </div>
                          <DialogFooter>
                            <Button type="submit">Tambah</Button>
                            <Button type="button" variant="outline" onClick={() => setIsTestimonialDialogOpen(false)}>Batal</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Peran</TableHead>
                        <TableHead>Isi</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testimonials.map(t => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.name}</TableCell>
                          <TableCell>{t.role}</TableCell>
                          <TableCell>{t.content}</TableCell>
                          <TableCell>{t.rating}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteTestimonial(t.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
