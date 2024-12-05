import { createRouter, createWebHistory } from 'vue-router';
import ProductList from "@/components/ProductList.vue";
import ProductForm from "@/components/ProductForm.vue";

const routes = [
    {
        path: '/',
        name: 'ProductList',
        component: ProductList, // Affiche le composant ProductList à la racine
    },
    {
        path: '/add',
        name: 'ProductForm',
        component: ProductForm, // Affiche le formulaire pour ajouter un produit
    },
    {
        path: '/ProductList', // Vous pouvez aussi ajouter cette route si vous voulez accéder directement à /ProductList
        name: 'ProductListPage',
        component: ProductList,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
