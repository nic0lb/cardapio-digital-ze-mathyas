const menuContainer = document.getElementById("menu");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const categoryNav = document.getElementById("category-nav");
const cartModal = document.getElementById("cart-modal");

let carrinho = [];
const TELEFONE_RESTAURANTE = "5585999999999"; // Ajuste para o número do Zé Mathyas

// ---------- FUNÇÕES GLOBAIS ----------

window.abrirCarrinho = function() {
    if (cartModal) cartModal.style.display = "flex";
};

window.fecharCarrinho = function() {
    if (cartModal) cartModal.style.display = "none";
};

window.scrollToMenu = function() {
    if (menuContainer) menuContainer.scrollIntoView({ behavior: "smooth" });
};

// ---------- INICIALIZAÇÃO ----------
function init() {
    renderCategoryNav();
    renderMenu();

    const urlParams = new URLSearchParams(window.location.search);
    const mesaURL = urlParams.get('mesa');

    if (mesaURL) {
        const seletorMesa = document.getElementById("mesa-select");
        const welcomeDiv = document.getElementById("welcome-message");
        const mesaSpan = document.getElementById("mesa-numero");

        if (seletorMesa) {
            seletorMesa.value = mesaURL;
            if (welcomeDiv && mesaSpan) {
                mesaSpan.textContent = mesaURL.includes("Mesa") ? mesaURL : `Mesa ${mesaURL}`;
                welcomeDiv.style.display = "block";
            }
        }
    }
}

// ---------- RENDERIZAR CATEGORIAS ----------
function renderCategoryNav() {
    if (!categoryNav) return;
    const categorias = [...new Set(produtos.map(p => p.categoria))];
    
    categoryNav.innerHTML = "";
    categorias.forEach(categoria => {
        const btn = document.createElement("button");
        btn.className = "category-tab";
        btn.textContent = categoria;
        
        btn.onclick = (e) => {
            e.stopPropagation();
            const sectionId = `cat-${categoria.replace(/\s+/g, '-')}`;
            const section = document.getElementById(sectionId);
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 100,
                    behavior: "smooth"
                });
            }
        };
        categoryNav.appendChild(btn);
    });
}

// ---------- RENDERIZAR MENU ----------
function renderMenu() {
    if (!menuContainer) return;
    menuContainer.innerHTML = ""; 

    const categorias = [...new Set(produtos.map(p => p.categoria))];

    categorias.forEach(categoria => {
        const section = document.createElement("section");
        section.id = `cat-${categoria.replace(/\s+/g, '-')}`;
        section.className = "category-section";

        const title = document.createElement("h2");
        title.className = "category-title";
        title.textContent = categoria;
        section.appendChild(title);

        const productsGrid = document.createElement("div");
        productsGrid.className = "products-grid";

        produtos
            .filter(p => p.categoria === categoria)
            .forEach(produto => {
                const div = document.createElement("div");
                div.className = "product-card";

                div.innerHTML = `
                    <img src="${produto.imagem || 'https://via.placeholder.com/300x180'}" class="product-img">
                    <div class="product-info">
                        <div>
                            <h3 class="product-title">${produto.nome}</h3>
                            <p class="product-description">${produto.descricao}</p>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                            <span class="product-price">R$ ${produto.preco.toFixed(2)}</span>
                            <button class="add-to-cart-btn" onclick="addToCart(${produto.id})">Adicionar</button>
                        </div>
                    </div>
                `;
                productsGrid.appendChild(div);
            });

        section.appendChild(productsGrid);
        menuContainer.appendChild(section);
    });
}

// ---------- LÓGICA DO CARRINHO ----------

window.addToCart = function(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    const itemExistente = carrinho.find(item => item.id === id);
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    atualizarCarrinho();
};

window.alterarQuantidade = function(id, delta) {
    const item = carrinho.find(item => item.id === id);
    if (!item) return;

    item.quantidade += delta;
    if (item.quantidade <= 0) {
        carrinho = carrinho.filter(i => i.id !== id);
    }
    atualizarCarrinho();
};

function atualizarCarrinho() {
    const subtotal = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const taxaCheckbox = document.getElementById("taxa-servico");
    
    let totalExibido = subtotal;
    if (taxaCheckbox && taxaCheckbox.checked) {
        totalExibido = subtotal * 1.10;
    }

    cartCount.textContent = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    cartTotal.textContent = totalExibido.toFixed(2);
    renderCarrinhoDetalhado();
}

function renderCarrinhoDetalhado() {
    const container = document.getElementById("cart-items");
    if (!container) return;
    container.innerHTML = "";

    if (carrinho.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#888; padding: 20px;'>Seu carrinho está vazio.</p>";
        return;
    }

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div style="display:flex; flex-direction:column;">
                <strong>${item.nome}</strong>
                <small>R$ ${item.preco.toFixed(2)}</small>
            </div>
            <div class="qty-control">
                <button onclick="alterarQuantidade(${item.id}, -1)">-</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// ---------- FUNÇÕES DE COMUNICAÇÃO (WHATSAPP) ----------

window.chamarGarcom = function() {
    const mesa = document.getElementById("mesa-select").value;
    if (!mesa) return alert("Por favor, selecione sua mesa para chamar o garçom.");

    const msg = `🔔 *CHAMADO DE GARÇOM*%0A📍 Mesa: *${mesa}*%0A_Por favor, venha até a mesa._`;
    window.open(`https://wa.me/${TELEFONE_RESTAURANTE}?text=${msg}`, "_blank");
};

window.finalizarPedido = function() {
    const mesa = document.getElementById("mesa-select").value;
    const obs = document.getElementById("order-obs").value;
    const taxaCheckbox = document.getElementById("taxa-servico");
    
    if (!mesa) return alert("Por favor, identifique a sua mesa.");
    if (carrinho.length === 0) return alert("Adicione itens ao carrinho primeiro!");

    const subtotal = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const incluirTaxa = taxaCheckbox && taxaCheckbox.checked;
    const totalFinal = incluirTaxa ? (subtotal * 1.10) : subtotal;

    let msg = `🔥 *NOVO PEDIDO - ZÉ MATHYAS* 🔥%0A`;
    msg += `📍 *MESA: ${mesa}*%0A`;
    msg += `------------------------------%0A`;
    
    carrinho.forEach(item => {
        msg += `✅ *${item.quantidade}x* ${item.nome}%0A`;
    });

    if (obs.trim() !== "") {
        msg += `%0A📝 *Obs:* _${obs.trim()}_%0A`;
    }

    msg += `------------------------------%0A`;
    msg += `💰 Subtotal: R$ ${subtotal.toFixed(2)}%0A`;
    msg += `🤝 Taxa (10%): ${incluirTaxa ? "Inclusa" : "Não inclusa"}%0A`;
    msg += `⭐ *TOTAL: R$ ${totalFinal.toFixed(2)}*%0A`;

    window.open(`https://wa.me/${TELEFONE_RESTAURANTE}?text=${msg}`, "_blank");

    mostrarSucesso();
    carrinho = [];
    document.getElementById("order-obs").value = "";
    atualizarCarrinho();
    fecharCarrinho();
};

function mostrarSucesso() {
    let alertDiv = document.querySelector(".success-alert");
    if (!alertDiv) {
        alertDiv = document.createElement("div");
        alertDiv.className = "success-alert";
        alertDiv.innerHTML = `<span>✅</span> Pedido enviado com sucesso!`;
        document.body.appendChild(alertDiv);
    }
    setTimeout(() => alertDiv.classList.add("show"), 100);
    setTimeout(() => alertDiv.classList.remove("show"), 4000);
}

init();