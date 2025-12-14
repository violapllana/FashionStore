// import { useEffect, useState } from 'react';
// import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
// import axios from 'axios';

// export default function AdminProducts() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [name, setName] = useState('');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');

//   const fetchProducts = () => {
//     setLoading(true);
//     axios.get('http://localhost:5000/api/products')
//       .then(res => setProducts(res.data.products))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleCreate = () => {
//     axios.post('http://localhost:5000/api/products', { name, price, description }, {
//       headers: { Authorization: 'Bearer <YOUR_ADMIN_TOKEN>' }
//     })
//       .then(() => { setName(''); setPrice(''); setDescription(''); fetchProducts(); });
//   };

//   const handleDelete = (id) => {
//     axios.delete(`http://localhost:5000/api/products/${id}`, {
//       headers: { Authorization: 'Bearer <YOUR_ADMIN_TOKEN>' }
//     }).then(fetchProducts);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Admin Products</Text>

//       {/* CREATE PRODUCT */}
//       <View style={styles.inputGroup}>
//         <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input}/>
//         <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric"/>
//         <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input}/>
//         <Pressable style={styles.button} onPress={handleCreate}>
//           <Text style={styles.buttonText}>Create Product</Text>
//         </Pressable>
//       </View>

//       {/* PRODUCT LIST */}
//       {loading ? <ActivityIndicator size="large" color="#ff4d6d"/> :
//       products.map(p => (
//         <View key={p.id} style={styles.productCard}>
//           <Text style={styles.productText}>{p.name} - ${p.price}</Text>
//           <Text style={styles.productText}>{p.description}</Text>
//           <Pressable style={styles.deleteBtn} onPress={() => handleDelete(p.id)}>
//             <Text style={styles.buttonText}>Delete</Text>
//           </Pressable>
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex:1, padding:20 },
//   title: { fontSize:24, fontWeight:'700', marginBottom:20 },
//   inputGroup: { marginBottom:20 },
//   input: { borderWidth:1, borderColor:'#ccc', borderRadius:10, padding:10, marginBottom:10 },
//   button: { backgroundColor:'#ff4d6d', padding:12, borderRadius:10, alignItems:'center' },
//   buttonText: { color:'#fff', fontWeight:'700' },
//   productCard: { padding:10, borderWidth:1, borderColor:'#ccc', borderRadius:10, marginBottom:10 },
//   productText: { fontSize:16 },
//   deleteBtn: { backgroundColor:'#000', padding:8, borderRadius:10, marginTop:5, alignItems:'center' },
// });
import { View, Text, TextInput, Pressable, FlatList, Alert, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [sizes, setSizes] = useState('');
  const [colors, setColors] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async () => {
    try {
      const body = {
        name,
        description,
        price: parseFloat(price),
        category,
        sizes: sizes.split(',').map(s => s.trim()).filter(s => s),
        colors: colors.split(',').map(c => c.trim()).filter(c => c),
        imageUrl
      };

      if (editingId !== null) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, body);
        Alert.alert('Updated', 'Product updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/products', body);
        Alert.alert('Created', 'Product created successfully');
      }

      setName(''); setDescription(''); setPrice(''); setCategory(''); setSizes(''); setColors(''); setImageUrl('');
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not save product');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setCategory(product.category);
    setSizes(Array.isArray(product.sizes) ? product.sizes.join(',') : product.sizes || '');
    setColors(Array.isArray(product.colors) ? product.colors.join(',') : product.colors || '');
    setImageUrl(product.imageUrl);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      Alert.alert('Deleted', 'Product deleted successfully');
      fetchProducts();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not delete product');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products Management</Text>

      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} />
      <TextInput placeholder="Sizes (comma separated)" value={sizes} onChangeText={setSizes} style={styles.input} />
      <TextInput placeholder="Colors (comma separated)" value={colors} onChangeText={setColors} style={styles.input} />
      <TextInput placeholder="Image URL" value={imageUrl} onChangeText={setImageUrl} style={styles.input} />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{editingId !== null ? 'Update Product' : 'Add Product'}</Text>
      </Pressable>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>{item.category} | ${item.price}</Text>
            <Text>Sizes: {Array.isArray(item.sizes) ? item.sizes.join(', ') : item.sizes}</Text>
            <Text>Colors: {Array.isArray(item.colors) ? item.colors.join(', ') : item.colors}</Text>
            <View style={styles.buttonsRow}>
              <Pressable style={styles.editBtn} onPress={() => handleEdit(item)}>
                <Text>Edit</Text>
              </Pressable>
              <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                <Text>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: '#000', padding: 12, borderRadius: 8, marginBottom: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  productCard: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 10 },
  productName: { fontWeight: 'bold', fontSize: 16 },
  buttonsRow: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
  editBtn: { backgroundColor: '#FFD700', padding: 6, borderRadius: 4 },
  deleteBtn: { backgroundColor: '#FF6347', padding: 6, borderRadius: 4 },
});
