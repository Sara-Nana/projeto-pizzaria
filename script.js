let cart = [];
let modalQtd = 1
let modalKey = 0;
const qs = (element)=>document.querySelector(element);
const qsa = (element)=>document.querySelectorAll(element);


pizzaJson.map( (item, index) => {
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);
    
    pizzaItem.setAttribute('data-key', index);

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e)=>{

        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        let modalQtd = 1
        modalKey = key;

        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--price .pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        //abrindo Modal
        qs('.pizzaWindowArea').style.display = 'flex';
        qs('.pizzaWindowArea').style.opacity = '0';
        setTimeout(()=>{
            qs('.pizzaWindowArea').style.opacity = '1';
        }, 200);

        qs('.pizzaInfo--qt').innerHTML = modalQtd

        qsa('.pizzaInfo--size').forEach((size, sizeIndex)=>{

            if(sizeIndex === 2) {
                size.classList.add('selected')
            } else {
                size.classList.remove('selected'); 
            }

            size.addEventListener('click', ()=>{
                let priceAdjustment = 0;

                qsa('.pizzaInfo--size').forEach((sizes) => sizes.classList.remove('selected'));

                size.classList.add('selected');

                if(sizeIndex === 1) {
                    priceAdjustment = 2
                } else if ( sizeIndex === 0) {
                    priceAdjustment = 6
                }

                let basePrice = pizzaJson[key].price; 
                let finalPrice = basePrice - priceAdjustment;

                qs('.pizzaInfo--price .pizzaInfo--actualPrice').innerHTML = `R$ ${finalPrice.toFixed(2)}`;

            })

            size.querySelector('.pizzaInfo--size span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        })
        
    })

    qs('.pizza-area').append(pizzaItem);
});

function closeModal(){
    qs('.pizzaWindowArea').style.opacity = '0';
    setTimeout(()=>{
        qs('.pizzaWindowArea').style.display = 'none';
    }, 300);
    
    modalQtd = 1
};

qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

qs('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    
    if(modalQtd <= 9) {
        modalQtd++;
        qs('.pizzaInfo--qt').innerHTML = modalQtd;
    };
    
});
qs('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    
    if(modalQtd > 1) {
        modalQtd--;
        qs('.pizzaInfo--qt').innerHTML = modalQtd;
    };
    
});


qs('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);

   if(key > -1) {
       cart[key].qt += modalQtd;

    } else if(key == -1) {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQtd
        });
    };

    updateCart();
    closeModal();
});

function updateCart() {

    qs('.menu-openner span').innerHTML = cart.length;


    if(cart.length > 0) {

        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {

            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = qs('.models .cart--item').cloneNode(true); 
            
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            };

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });


            qs('.cart').append(cartItem);
        };

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    };
};

qs('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        qs('aside').style.left = '0';
    } else {
        customAlert();
    }
});
qs('.menu-closer').addEventListener('click', ()=>{
    qs('aside').style.left = '100vw';
});

function customAlert() {
    let overlay = document.querySelector('.overlay'); 
    let customAlert = document.querySelector('.custom-alert');
    let notification = document.querySelector('.notification');

    if (cart.length > 0) {
        notification.innerHTML = 'Pedido realizado com sucesso!';
    } else {
        notification.innerHTML = 'Seu carrinho está vazio!';
    }

    overlay.style.display = 'block';
    customAlert.style.display = 'flex';

    setTimeout(function() { 
        customAlert.style.opacity = '1'; 
        overlay.style.opacity = '1'; 
    }, 200);
    
    qs('.custom-alert-button').addEventListener('click', ()=>{
        overlay.style.display = 'none';
        customAlert.style.display = 'none';
    });
    overlay.addEventListener('click', () => { 
        overlay.style.display = 'none'; 
        customAlert.style.display = 'none';
    });
}

qs('.cart--finalizar').addEventListener('click', ()=>{
    customAlert();
});
    