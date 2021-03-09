let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (el) => document.querySelector(el); //função anonima que retorna o item
const cs = (el) => document.querySelectorAll(el); //função anonima que retorna o array com os itens que achou


//Listagem das pizzas
//função para clonar o modelo html pizza-item
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    

    //define o index de cada uma das pizzas, de acordo com a área do html dela
    pizzaItem.setAttribute('data-key', index);
    //preenchendo informações da pizza
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    // função ${} formata o preço para aparecer 2 casas após a virgula
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    //função para abrir o modal da pizza
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        //faz o click na pizza não atualizar a pagína
        e.preventDefault();
        
        /*pegando a informação de qual pizza foi clicada, para ser inserido seus dados no modal
        closest acha o elemento mais proximo ao clique, que possui a classe .pizza-item
        getAttribute pega o data-key que possui a chave de onde foi clicado*/
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        //definindo que a quantidade será 1 quando o modal for aberto
        modalQt = 1;

        modalKey = key;
        
        //seta o painel de opções da pizza com a opacidade em 0
        c('.pizzaWindowArea').style.opacity = 0;

        //altera o display:none do css do painel de opções da pizza para display:flex
        c('.pizzaWindowArea').style.display = 'flex'; 

        //ao decorrer de 2s a opacidade sai de 0 e vai para 1 no painel de opções da pizza
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);

        //preenchendo as informações da pizza no modal
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        
        //o item que tiver a classe pizzainfosize e tambem selected, sera acessado e removido a classe selected
        c('.pizzaInfo--size.selected').classList.remove('selected');


        //preenchendo as informações de acordo com os tamanhos da pizza
        //dentro do pizzaInfo--size vamos selecionar a tag span
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            //quando sizeindex for 2 (tamanho grande), o elemento vai ser acessado e sera adicionado
            //a classe selecionada
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            
            //acessando o tamanho da pizza
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        //sempre que o modal for aberto, ele seleciona a classe pizzainfo--qt e abrirá com a quantidade padrão que é 1
        c('.pizzaInfo--qt').innerHTML = modalQt;

    });

    c('.pizza-area').append(pizzaItem);
});



//Eventos específicos do modal
function closeModal(){
    //seta o painel de opções da pizza com a opacidade em 0
    c('.pizzaWindowArea').style.opacity = 0;

    //ao decorrer de 0,5s o modal some e recebe display none
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

//para cada um dos botoes, ao click, ira ser executada a função do fechar o modal
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});


//botao de + e - na quantidade de pizzas
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    //garantindo que o numero de pizzas no modal nao seja 0 ou negativo
    if(modalQt > 1){
        modalQt--;
    }

    //atualiza no modal a quantidade
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    //incrementa 1 no modal qt que começa em 1
    modalQt++;
    //atualiza no modal a quantidade
    c('.pizzaInfo--qt').innerHTML = modalQt;
});


//vamos selecionar os tamanhos e adicionar o evento de click em cada um deles
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    //primeiro vamos remover a seleção de qualquer item que esteja marcado e após
    //é marcado o clicado
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//adicionando o evento de click, reunindo as informações e adicionando no carrinho de compras
//let cart= []; array para armazenar as info
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //precisamos saber qual é a pizza, qual é o tamanho e qual é a quantidade
    //sempre que o modal for aberto, modalKey vai ser preenchido com as informaçoes dele

    //identificando o tamanho da pizza
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    //juntar o id da pizza e o tamanho dela, para padronizar a identificação das pizzas
    let identifier = pizzaJson[modalKey].id+'@'+size;

    //identificar se existe o mesmo item no carrinho, caso encontre, é retornado o index dele, caso naom, retorna -1
    let key = cart.findIndex((item)=>{
        return item.identifier == identifier;
    });

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        //adicionando ao carrinho
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }

    closeModal();
    updateCart();
    
});

//evento para abrir o carrinho no mobile
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

//evento para o X do carrinho funcionar no mobile
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
})

//função para atualizar o carrinho de compras 
function updateCart(){
    //sempre que o updateCart rodar, o número da qtd de itens dentro, do mobile, vai ser atualizado
    c('.menu-openner span').innerHTML = cart.length;

    //se o numero de itens for maior que 0, ele mostra o carrinho
    if(cart.length > 0){
        //para mostrar o carrinho, selecionamos a tag aside e chamamos o classList
        //e adicionamos a classe show
        c('aside').classList.add('show');

        //zerar a lista dos itens
        c('.cart').innerHTML = '';

        //variaveis do preço
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        //for para pegar item a item e exibir na tela
        for(let i in cart){
            //primeiro vamos identificar e encontrar as informações e retornar todos os dados da pizza
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            
            //calculo dos subtotais
            subtotal += pizzaItem.price * cart[i].qt;

            //clonando os itens
            let cartItem = c('.models .cart--item').cloneNode(true);

            //variavel para preencher o tamanho da pizza
            let pizzaSizeName;
            //switch para preencher o sizeName de acordo com o valor 0, 1 ou 2
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            //variavel para concatenar o nome da pizza e o tamanho
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //preenchendo as informações da pizza na tela 
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            
            //botao de retirar qtd da pizza
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            
            //botao de adicionar qtd da pizza
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            //exibir os dados das pizzas no carrinho
            c('.cart').append(cartItem); 
        }

        //calculo do 10% de desconto
        desconto = subtotal * 0.1;

        //calculo do total
        total = subtotal - desconto;

        //exibindo o preço na tela
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else {
        c('aside').classList.remove('show');
        //definindo 100vw para o carrinho fechar quando a qtd for mudada para 0 no mobile
        c('aside').style.left = '100vw';
    } 
} 





