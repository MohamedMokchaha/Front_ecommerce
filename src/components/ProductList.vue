<template>
  <div class="container-fluid mt-5">
    <div class="row">
      <!-- Sidebar à gauche (Filtres) -->
      <div class="col-md-12 sidebar">
        <div class="filters">
          <div class="filter-item">
            <input
                class="form-check-input"
                type="checkbox"
                id="in-stock"
                v-model="filterInStock"
                @change="fetchProducts"
            />
            <label class="form-check-label" for="in-stock">
              <span class="filter-text">En Stock</span>
              <i class="fas fa-check-circle filter-icon"></i>
            </label>
          </div>

          <div class="filter-item">
            <input
                class="form-check-input"
                type="checkbox"
                id="out-of-stock"
                v-model="filterOutOfStock"
                @change="fetchProducts"
            />
            <label class="form-check-label" for="out-of-stock">
              <span class="filter-text">Hors Stock</span>
              <i class="fas fa-times-circle filter-icon"></i>
            </label>
          </div>
        </div>
      </div>

      <br>


      <!-- Champ de recherche avec bouton -->
      <div class="col-md-12 mt-3 search-container">
        <input
            type="text"
            class="form-control"
            placeholder="Rechercher un produit"
            v-model="searchQuery"
            @input="fetchProducts"
        />
        <button class="btn btn-primary search-btn" @click="searchProduct">
          <i class="fas fa-search"></i> Chercher
        </button>


      </div>


      <!-- Fond semi-transparent derrière le popup -->
      <div v-if="selectedProduct || isAddProduct" class="product-update-overlay active" @click="closePopup"></div>

      <!-- Formulaire de mise à jour sous forme de popup -->
      <div v-if="selectedProduct" class="product-update active">
        <span class="close-btn" @click="closePopup">&times;</span>
        <h3>Modifier le produit</h3>
        <form @submit.prevent="updateProduct(selectedProduct)">
          <div class="form-group">
            <label for="name">Nom</label>
            <input type="text" class="form-control" id="name" v-model="selectedProduct.name" required />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <input type="text" class="form-control" id="description" v-model="selectedProduct.description" required />
          </div>
          <div class="form-group">
            <label for="price">Prix</label>
            <input type="number" class="form-control" id="price" v-model="selectedProduct.price" required />
          </div>
          <div class="form-group">
            <label for="stock">Stock</label>
            <input type="number" class="form-control" id="stock" v-model="selectedProduct.stock" required />
          </div>
          <button type="submit" class="btn btn-primary">Mettre à jour</button>
        </form>
      </div>

      <!-- Formulaire d'ajout sous forme de popup -->
      <div v-if="isAddProduct" class="product-update active">
        <span class="close-btn" @click="closePopup">&times;</span>
        <h3>Ajouter un produit</h3>
        <form @submit.prevent="addProduct">
          <div class="form-group">
            <label for="addName">Nom</label>
            <input type="text" class="form-control" id="addName" v-model="newProduct.name" required />
          </div>
          <div class="form-group">
            <label for="addDescription">Description</label>
            <input type="text" class="form-control" id="addDescription" v-model="newProduct.description" required />
          </div>
          <div class="form-group">
            <label for="addPrice">Prix</label>
            <input type="number" class="form-control" id="addPrice" v-model="newProduct.price" required />
          </div>
          <div class="form-group">
            <label for="addStock">Stock</label>
            <input type="number" class="form-control" id="addStock" v-model="newProduct.stock" required />
          </div>
          <button type="submit" class="btn btn-primary">Ajouter</button>
        </form>
      </div>

      <!-- Liste des produits en tableau -->
      <div class="col-md-12 product-table">
        <table class="table">
          <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Actions</th>
            <th>
              <button class="btn btn-success add-product-btn" @click="openAddProductPopup">
                <i class="fas fa-plus"></i> Produit
              </button>
            </th>
          </tr>

          </thead>
          <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ product.price }}€</td>
            <td>
              <span :class="{'text-success': product.stock > 0, 'text-danger': product.stock === 0}">{{ product.stock > 0 ? 'En Stock' : 'Hors Stock' }}</span>
            </td>
            <td>
              <i class="fas fa-edit action-icon" @click="selectProductToUpdate(product)"></i>
              <i class="fas fa-trash-alt action-icon" @click="deleteProduct(product.id)"></i>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      filterInStock: false,
      filterOutOfStock: false,
      selectedProduct: null,
      isAddProduct: false,  // Ajouter un flag pour afficher la popup d'ajout
      newProduct: {
        name: '',
        description: '',
        price: null,
        stock: null,
      },
      searchQuery: '',  // Variable pour la recherche
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products;

      if (this.searchQuery) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      if (this.filterInStock && this.filterOutOfStock) {
        return filtered;
      }
      if (this.filterInStock) {
        return filtered.filter(product => product.stock > 0);
      }
      if (this.filterOutOfStock) {
        return filtered.filter(product => product.stock === 0);
      }
      return filtered;
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/');
        this.products = response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    },
    searchProduct() {
      this.fetchProducts();
    },
    selectProductToUpdate(product) {
      this.selectedProduct = { ...product };  // Crée une copie du produit pour la modification
    },
    async updateProduct(updatedProduct) {
      try {
        await axios.put(`http://127.0.0.1:8000/api/products/${updatedProduct.id}/`, updatedProduct);
        // Met à jour la liste des produits localement
        const index = this.products.findIndex(product => product.id === updatedProduct.id);
        this.products.splice(index, 1, updatedProduct);
        this.selectedProduct = null;
      } catch (error) {
        console.error("Erreur lors de la mise à jour du produit :", error);
        alert('Une erreur est survenue lors de la mise à jour.');
      }
    },
    async deleteProduct(productId) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/products/${productId}/`);
        this.products = this.products.filter(product => product.id !== productId);
        alert('Produit supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        alert('Une erreur est survenue lors de la suppression.');
      }
    },
    openAddProductPopup() {
      this.isAddProduct = true;
    },
    closePopup() {
      this.selectedProduct = null;
      this.isAddProduct = false;
    },
    async addProduct() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/products/', this.newProduct);
        this.products.push(response.data);
        this.newProduct = { name: '', description: '', price: null, stock: null };  // Reset le formulaire
        this.isAddProduct = false;
      } catch (error) {
        console.error("Erreur lors de l'ajout du produit :", error);
        alert('Une erreur est survenue lors de l\'ajout.');
      }
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>


<style scoped>

@import url('@/assets/css/styles.css');



</style>
