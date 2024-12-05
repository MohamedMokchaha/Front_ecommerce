<template>
  <div>
    <h1>Ajouter un produit</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Nom du produit:</label>
        <input type="text" v-model="name" id="name" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="description" id="description" required></textarea>
      </div>
      <div>
        <label for="price">Prix:</label>
        <input type="number" v-model="price" id="price" required />
      </div>
      <div>
        <label for="stock">Stock:</label>
        <input type="number" v-model="stock" id="stock" required />
      </div>
      <button type="submit">Ajouter le produit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      name: '',
      description: '', // Ajout de la description
      price: '',
      stock: '',
    };
  },
  methods: {
    async submitForm() {
      // Créer un objet produit avec les données du formulaire
      const productData = {
        name: this.name,
        description: this.description,  // Ajout de la description
        price: parseFloat(this.price),
        stock: parseInt(this.stock),
      };

      try {
        // Envoyer les données à l'API
        const response = await axios.post('http://127.0.0.1:8000/api/products/', productData);

        console.log('Produit ajouté:', response.data);

        // Réinitialiser le formulaire
        this.name = '';
        this.description = ''; // Réinitialisation de la description
        this.price = '';
        this.stock = '';

        // Optionnel : rediriger vers la liste des produits après l'ajout
        this.$router.push('/'); // Remplacez par la route de votre liste de produits
      } catch (error) {
        console.error('Erreur lors de l\'ajout du produit:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Style pour votre formulaire d'ajout */
h1 {
  font-size: 24px;
  color: #333;
}
form {
  margin-top: 20px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input, textarea {
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
}
button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
</style>
