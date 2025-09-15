// Admin panel functionality
class AdminPanel {
    constructor() {
        this.currentTab = 'dashboard';
        this.products = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', this.logout.bind(this));

        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', this.toggleSidebar.bind(this));

        // Product management
        document.getElementById('addProductBtn').addEventListener('click', () => this.openProductModal());
        document.getElementById('closeModal').addEventListener('click', () => this.closeProductModal());
        document.getElementById('cancelModal').addEventListener('click', () => this.closeProductModal());
        document.getElementById('productForm').addEventListener('submit', this.saveProduct.bind(this));
        document.getElementById('filterProducts').addEventListener('click', this.filterProducts.bind(this));

        // Close modal on outside click
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target.id === 'productModal') {
                this.closeProductModal();
            }
        });
    }

    switchTab(tab) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active', 'bg-green-50', 'text-green-700');
            if (item.dataset.tab === tab) {
                item.classList.add('active', 'bg-green-50', 'text-green-700');
            }
        });

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tab).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            products: 'Gestión de Productos',
            services: 'Gestión de Servicios',
            settings: 'Configuración'
        };
        document.getElementById('pageTitle').textContent = titles[tab];

        this.currentTab = tab;

        // Load data for specific tabs
        if (tab === 'products') {
            this.loadProducts();
        }
    }

    async logout() {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            });

            if (response.ok) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('main-content');
        
        sidebar.classList.toggle('-translate-x-full');
        mainContent.classList.toggle('ml-0');
        mainContent.classList.toggle('ml-64');
    }

    async loadDashboardData() {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();

            if (data.success) {
                this.products = data.data;
                this.updateDashboardStats();
                this.displayRecentProducts();
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    updateDashboardStats() {
        const totalProducts = this.products.length;
        const activeProducts = this.products.filter(p => p.activo).length;
        const totalStock = this.products.reduce((sum, p) => sum + p.stock, 0);
        const categories = [...new Set(this.products.map(p => p.categoria))].length;

        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('activeProducts').textContent = activeProducts;
        document.getElementById('totalStock').textContent = totalStock;
        document.getElementById('totalCategories').textContent = categories;
    }

    displayRecentProducts() {
        const recentProducts = this.products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const container = document.getElementById('recentProducts');
        container.innerHTML = '';

        if (recentProducts.length === 0) {
            container.innerHTML = '<p class="text-gray-500">No hay productos recientes</p>';
            return;
        }

        recentProducts.forEach(product => {
            const productEl = document.createElement('div');
            productEl.className = 'flex items-center justify-between p-4 border border-gray-200 rounded-lg';
            productEl.innerHTML = `
                <div class="flex items-center space-x-4">
                    <img src="${product.imagen}" alt="${product.titulo}" class="w-12 h-12 object-cover rounded-lg">
                    <div>
                        <h4 class="font-medium text-gray-900">${product.titulo}</h4>
                        <p class="text-sm text-gray-500">${product.categoria}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-medium text-gray-900">$${product.precioDescuento.toLocaleString()}</p>
                    <p class="text-sm text-gray-500">Stock: ${product.stock}</p>
                </div>
            `;
            container.appendChild(productEl);
        });
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();

            if (data.success) {
                this.products = data.data;
                this.displayProductsTable();
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    displayProductsTable() {
        const container = document.getElementById('productsTable');
        
        if (this.products.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No hay productos disponibles</p>';
            return;
        }

        const tableHTML = `
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${this.products.map(product => `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <img src="${product.imagen}" alt="${product.titulo}" class="w-10 h-10 object-cover rounded-lg mr-4">
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">${product.titulo}</div>
                                        <div class="text-sm text-gray-500">${product.descripcion.substring(0, 50)}...</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.categoria}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">$${product.precioDescuento.toLocaleString()}</div>
                                <div class="text-sm text-gray-500 line-through">$${product.precioOriginal.toLocaleString()}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.stock}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                    ${product.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onclick="adminPanel.editProduct('${product.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                                <button onclick="adminPanel.deleteProduct('${product.id}')" class="text-red-600 hover:text-red-900">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    async filterProducts() {
        const category = document.getElementById('categoryFilter').value;
        const status = document.getElementById('statusFilter').value;

        let url = '/api/products?';
        const params = new URLSearchParams();

        if (category) params.append('categoria', category);
        if (status) params.append('activo', status);

        try {
            const response = await fetch(url + params.toString());
            const data = await response.json();

            if (data.success) {
                this.products = data.data;
                this.displayProductsTable();
            }
        } catch (error) {
            console.error('Error filtering products:', error);
        }
    }

    openProductModal(productId = null) {
        const modal = document.getElementById('productModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('productForm');

        form.reset();
        document.getElementById('productActive').checked = true;

        if (productId) {
            title.textContent = 'Editar Producto';
            this.loadProductData(productId);
        } else {
            title.textContent = 'Agregar Producto';
            document.getElementById('productId').value = '';
        }

        modal.classList.remove('hidden');
    }

    closeProductModal() {
        document.getElementById('productModal').classList.add('hidden');
    }

    async loadProductData(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            const data = await response.json();

            if (data.success) {
                const product = data.data;
                document.getElementById('productId').value = product.id;
                document.getElementById('productTitle').value = product.titulo;
                document.getElementById('productDescription').value = product.descripcion;
                document.getElementById('productImage').value = product.imagen;
                document.getElementById('productOriginalPrice').value = product.precioOriginal;
                document.getElementById('productDiscountPrice').value = product.precioDescuento;
                document.getElementById('productCategory').value = product.categoria;
                document.getElementById('productStock').value = product.stock;
                document.getElementById('productActive').checked = product.activo;
            }
        } catch (error) {
            console.error('Error loading product data:', error);
        }
    }

    async saveProduct(e) {
        e.preventDefault();

        const productId = document.getElementById('productId').value;
        const formData = {
            titulo: document.getElementById('productTitle').value,
            descripcion: document.getElementById('productDescription').value,
            imagen: document.getElementById('productImage').value,
            precioOriginal: parseFloat(document.getElementById('productOriginalPrice').value),
            precioDescuento: parseFloat(document.getElementById('productDiscountPrice').value),
            categoria: document.getElementById('productCategory').value,
            stock: parseInt(document.getElementById('productStock').value),
            activo: document.getElementById('productActive').checked
        };

        try {
            const url = productId ? `/api/products/${productId}` : '/api/products';
            const method = productId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                this.closeProductModal();
                this.loadProducts();
                this.loadDashboardData();
                this.showNotification('Producto guardado exitosamente', 'success');
            } else {
                this.showNotification(data.message, 'error');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            this.showNotification('Error al guardar el producto', 'error');
        }
    }

    async editProduct(productId) {
        this.openProductModal(productId);
    }

    async deleteProduct(productId) {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            return;
        }

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                this.loadProducts();
                this.loadDashboardData();
                this.showNotification('Producto eliminado exitosamente', 'success');
            } else {
                this.showNotification(data.message, 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showNotification('Error al eliminar el producto', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} animate__animated animate__fadeInRight`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('animate__fadeOutRight');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adminPanel = new AdminPanel();
});
