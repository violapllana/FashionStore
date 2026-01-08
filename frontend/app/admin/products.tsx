import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, Pressable, Image, ScrollView, StyleSheet, Alert, Modal, Platform
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

const CATEGORIES = ["Clothing","Shoes","Accessories","Bags"];
const SUBCATEGORIES = ["Tops","Jackets","Pants","Dresses"];
const GENDERS = ["Men","Women","Kids"];
const CLOTHING_SIZES = ["XS","S","M","L","XL","XXL"];
const SHOE_SIZES = ["36","37","38","39","40","41","42","43","44","45"];
const COLORS = ["Black","White","Red","Blue","Green"];

export default function ManageProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | "details" | "delete" | null>(null);
  const [current, setCurrent] = useState<any>(null);
  const [image, setImage] = useState<any>(null);

  const [form, setForm] = useState({
    name: "", description: "", price: "", category:"Clothing",
    subcategory:"", gender:"Men", sizes: [] as string[], colors: [] as string[]
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) { console.log(err); }
  };

  const reset = () => {
    setForm({ name:"", description:"", price:"", category:"Clothing", subcategory:"", gender:"Men", sizes:[], colors:[] });
    setImage(null);
    setCurrent(null);
  };

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!result.canceled) setImage(result.assets[0].uri);
    }
  };

  const toggleArray = (key: "sizes"|"colors", value:string) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter(v=>v!==value) : [...f[key], value]
    }));
  };

  const submit = async () => {
    if(!form.name || !form.price) return Alert.alert("Error","Name & Price required");

    const data = new FormData();
    Object.entries(form).forEach(([k,v]) => data.append(k, Array.isArray(v)?JSON.stringify(v):v as string));

    if(image){
      if(Platform.OS==="web") data.append("image", image);
      else{
        const filename = image.split("/").pop();
        const ext = filename?.split(".").pop();
        data.append("image", { uri:image, name: filename||"product.jpg", type:`image/${ext==="jpg"?"jpeg":ext}` } as any);
      }
    }

    try {
      if(modal==="add") await axios.post(API_URL, data, { headers:{ "Content-Type":"multipart/form-data" } });
      else if(modal==="edit" && current) await axios.put(`${API_URL}/${current.id}`, data, { headers:{ "Content-Type":"multipart/form-data" } });

      Alert.alert("✅ Success", modal==="add"?"Product added":"Product updated");
      setModal(null);
      reset();
      fetchProducts();
    } catch(err:any){ console.log(err.response?.data||err.message); Alert.alert("❌ Error","Action failed"); }
  };

  const deleteProduct = async () => {
    if(!current) return;
    try{
      await axios.delete(`${API_URL}/${current.id}`);
      Alert.alert("🗑 Deleted","Product removed");
      setModal(null);
      fetchProducts();
    } catch(err){ console.log(err); }
  };

  const openEditModal = (p?: any) => {
    if(p){
      setCurrent(p);
      setForm({...p, sizes:p.sizes||[], colors:p.colors||[]});
      setImage(p.image||null);
      setModal("edit");
    } else {
      reset();
      setModal("add");
    }
  };

  const openDetailsModal = (p: any) => {
    setCurrent(p);
    setForm({...p, sizes:p.sizes||[], colors:p.colors||[]});
    setModal("details");
  };

  const openDeleteModal = (p: any) => {
    setCurrent(p);
    setModal("delete");
  };

  const sizeOptions = form.category==="Shoes"?SHOE_SIZES:CLOTHING_SIZES;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Products</Text>

      <Pressable style={styles.addBtn} onPress={()=>openEditModal()}>
        <Text style={styles.addText}>+ Add Product</Text>
      </Pressable>

      {products.map(p=>(
        <View key={p.id} style={styles.card}>
          <Image source={{uri:p.image}} style={styles.img}/>
          <View style={{flex:1}}>
            <Text style={styles.name}>{p.name}</Text>
            <Text>${p.price}</Text>
          </View>
          <Pressable onPress={()=>openDetailsModal(p)}><Text style={styles.link}>Details</Text></Pressable>
          <Pressable onPress={()=>openEditModal(p)}><Text style={styles.link}>Edit</Text></Pressable>
          <Pressable onPress={()=>openDeleteModal(p)}><Text style={[styles.link,{color:"#ef4444"}]}>Delete</Text></Pressable>
        </View>
      ))}

      {/* Add/Edit Modal */}
      <Modal visible={modal==="add" || modal==="edit"} transparent animationType="slide">
        <View style={styles.overlay}>
          <ScrollView style={styles.modal}>
            <Text style={styles.modalTitle}>{modal==="add"?"Add":"Edit"} Product</Text>

            <TextInput style={styles.input} placeholder="Name" value={form.name} onChangeText={t=>setForm({...form,name:t})}/>
            <TextInput style={styles.input} placeholder="Description" value={form.description} onChangeText={t=>setForm({...form,description:t})}/>
            <TextInput style={styles.input} placeholder="Price" keyboardType="numeric" value={form.price} onChangeText={t=>setForm({...form,price:t})}/>

            <Text style={styles.label}>Category</Text>
            <View style={styles.wrap}>{CATEGORIES.map(c=>
              <Pressable key={c} onPress={()=>setForm({...form,category:c})} style={[styles.tag, form.category===c && styles.active]}><Text>{c}</Text></Pressable>
            )}</View>

            <Text style={styles.label}>Subcategory</Text>
            <View style={styles.wrap}>{SUBCATEGORIES.map(sc=>
              <Pressable key={sc} onPress={()=>setForm({...form,subcategory:sc})} style={[styles.tag, form.subcategory===sc && styles.active]}><Text>{sc}</Text></Pressable>
            )}</View>

            <Text style={styles.label}>Gender</Text>
            <View style={styles.wrap}>{GENDERS.map(g=>
              <Pressable key={g} onPress={()=>setForm({...form,gender:g})} style={[styles.tag, form.gender===g && styles.active]}><Text>{g}</Text></Pressable>
            )}</View>

            {Platform.OS==="web" ? (
              <input type="file" accept="image/*" style={{marginBottom:10}} onChange={(e:any)=>{const file=e.target.files[0]; if(file) setImage(file)}}/>
            ):(
              <Pressable style={styles.imageBox} onPress={pickImage}>
                {image || current?.image ? <Image source={{uri:image||current.image}} style={styles.imgBig}/> : <Text>Select Image</Text>}
              </Pressable>
            )}

            <Text style={styles.label}>Sizes</Text>
            <View style={styles.wrap}>{sizeOptions.map(s=>
              <Pressable key={s} onPress={()=>toggleArray("sizes",s)} style={[styles.tag, form.sizes.includes(s) && styles.active]}><Text>{s}</Text></Pressable>
            )}</View>

            <Text style={styles.label}>Colors</Text>
            <View style={styles.wrap}>{COLORS.map(c=>
              <Pressable key={c} onPress={()=>toggleArray("colors",c)} style={[styles.tag, form.colors.includes(c) && styles.active]}><Text>{c}</Text></Pressable>
            )}</View>

            <Pressable style={styles.saveBtn} onPress={submit}><Text style={{color:"#fff"}}>Save</Text></Pressable>
            <Pressable onPress={()=>setModal(null)}><Text style={styles.cancel}>Cancel</Text></Pressable>
          </ScrollView>
        </View>
      </Modal>

    <Modal visible={modal==="details"} transparent>
  <View style={styles.overlay}>
    <View style={styles.modal}>
      <Image source={{uri:current?.image}} style={styles.imgBig}/>
      <Text style={styles.name}>{current?.name}</Text>
      <Text>{current?.description}</Text>
      <Text>${current?.price}</Text>
      <Text>Category: {current?.category}</Text>
      <Text>Subcategory: {current?.subcategory}</Text>
      <Text>Gender: {current?.gender}</Text>

      {/* Parse sizes/colors if they are strings */}
      <Text>
        Sizes: {Array.isArray(current?.sizes) 
                  ? current.sizes.join(", ") 
                  : (current?.sizes ? JSON.parse(current.sizes).join(", ") : "")}
      </Text>
      <Text>
        Colors: {Array.isArray(current?.colors) 
                  ? current.colors.join(", ") 
                  : (current?.colors ? JSON.parse(current.colors).join(", ") : "")}
      </Text>

      <Pressable onPress={()=>setModal(null)}>
        <Text style={styles.cancel}>Close</Text>
      </Pressable>
    </View>
  </View>
</Modal>


      {/* Delete Modal */}
      <Modal visible={modal==="delete"} transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text>Are you sure you want to delete?</Text>
            <Pressable style={styles.deleteBtn} onPress={deleteProduct}><Text style={{color:"#fff"}}>Yes, Delete</Text></Pressable>
            <Pressable onPress={()=>setModal(null)}><Text style={styles.cancel}>Cancel</Text></Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#F2F6FF", padding:16 },
  title:{ fontSize:28, fontWeight:"700", marginBottom:16 },
  addBtn:{ backgroundColor:"#6C9EFF", padding:14, borderRadius:14, marginBottom:16 },
  addText:{ color:"#fff", textAlign:"center", fontWeight:"700" },
  card:{ flexDirection:"row", alignItems:"center", backgroundColor:"#fff", padding:12, borderRadius:14, marginBottom:10 },
  img:{ width:60, height:60, borderRadius:10, marginRight:10 },
  imgBig:{ width:200, height:200, borderRadius:14, marginBottom:10 },
  name:{ fontWeight:"700", fontSize:16 },
  link:{ marginHorizontal:6, color:"#2563eb" },
  overlay:{ flex:1, backgroundColor:"rgba(0,0,0,0.6)", justifyContent:"center", alignItems:"center" },
  modal:{ backgroundColor:"#fff", padding:20, borderRadius:16, width:"90%" },
  modalTitle:{ fontSize:20, fontWeight:"700", marginBottom:10 },
  input:{ borderWidth:1, borderColor:"#E2E8F0", padding:12, borderRadius:12, marginBottom:10 },
  imageBox:{ height:180, justifyContent:"center", alignItems:"center", borderWidth:1, borderRadius:14, marginBottom:12 },
  saveBtn:{ backgroundColor:"#6C9EFF", padding:14, borderRadius:12, marginTop:10 },
  deleteBtn:{ backgroundColor:"#ef4444", padding:14, borderRadius:12, marginTop:10 },
  cancel:{ marginTop:10, textAlign:"center", color:"#64748b" },
  label:{ fontWeight:"600", marginBottom:6 },
  tag:{ paddingVertical:6, paddingHorizontal:12, borderRadius:12, backgroundColor:"#eee", marginRight:6, marginBottom:6 },
  active:{ backgroundColor:"#6C9EFF", color:"#fff" },
  wrap:{ flexDirection:"row", flexWrap:"wrap", marginBottom:12 }
});
