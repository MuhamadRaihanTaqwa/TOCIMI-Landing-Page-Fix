import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
}

const AdminDashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => {
        const newData = { ...prev, [name]: checked };

        // If unchecking new category, reset category to Tas
        if (name === 'isNewCategory' && !checked) {
          newData.category = 'Tas';
          newData.newCategoryName = '';
        }
        return newData;
      });
    } else {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };

        // Auto-set category based on newCategoryName
        if (name === 'newCategoryName' && value.trim()) {
          newData.category = value.trim();
        }

        return newData;
      });
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
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
        try {
          imageUrl = await uploadImage(formData.imageFile);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast.error('Upload gambar gagal, namun produk akan disimpan tanpa gambar');
          // Continue without image
        }
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: formData.price,
        description: `Produk ${formData.name} kategori ${formData.category}`,
        image: imageUrl,
        isNew: formData.isNew,
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
      });

      // Reset file input
      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

      setEditingProduct(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Terjadi kesalahan: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }

    // Real-time listener for products
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
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
    });
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

  const seedProducts = async () => {
    const initialProducts = [
      {
        name: "Tas Tocimi",
        category: "Tas",
        price: "Rp 65.000",
        description: "Tas fashion Tocimi stylish dan modern",
        image: "/src/assets/tas tocimi.png",
        isNew: true,
      },
      {
        name: "Tas Style 2",
        category: "Tas",
        price: "Rp 70.000",
        description: "Tas selempang dengan desain elegan",
        image: "/src/assets/tas 2.png",
        isNew: true,
      },
      {
        name: "Tas Style 3",
        category: "Tas",
        price: "Rp 85.000",
        description: "Tas tote besar untuk sehari-hari",
        image: "/src/assets/tas 3.png",
        isNew: true,
      },
      {
        name: "Tas Style 4",
        category: "Tas",
        price: "Rp 85.000",
        description: "Tas mini compact dan praktis",
        image: "/src/assets/tas 4.png",
        isNew: true,
      },
      {
        name: "Tas Style 5",
        category: "Tas",
        price: "Rp 85.000",
        description: "Tas backpack multifungsi",
        image: "/src/assets/tas 5.png",
        isNew: true,
      },
      {
        name: "Tas Style 6",
        category: "Tas",
        price: "Rp 45.000",
        description: "Tas style 6 dengan desain unik",
        image: "/src/assets/tas 6.jpeg",
        isNew: true,
      },
      {
        name: "Tas Style 7",
        category: "Tas",
        price: "Rp 45.000",
        description: "Tas style 7 praktis dan stylish",
        image: "/src/assets/tas 7.jpeg",
        isNew: true,
      },
      {
        name: "Tas Style 8",
        category: "Tas",
        price: "Rp 65.000",
        description: "Tas style 8 elegan dan modern",
        image: "/src/assets/tas 8.jpeg",
        isNew: true,
      },
    ];

    try {
      for (const product of initialProducts) {
        await addDoc(collection(db, 'products'), product);
      }
      toast.success('Produk awal berhasil ditambahkan');
    } catch (error) {
      toast.error('Gagal menambahkan produk awal');
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
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
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
                  <Button onClick={seedProducts} variant="outline">
                    Seed Produk Awal
                  </Button>
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
                        {formData.isNewCategory && (
                          <div>
                            <Label htmlFor="newCategoryName">Nama Kategori Baru</Label>
                            <Input
                              id="newCategoryName"
                              name="newCategoryName"
                              value={formData.newCategoryName}
                              onChange={handleInputChange}
                              placeholder="Contoh: Sepatu, Baju, dll"
                              required
                            />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="image">Foto Produk (opsional)</Label>
                          <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleInputChange}
                          />
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
