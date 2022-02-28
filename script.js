// --SLIDER--
let time = 5000,
    currentImageIndex = 0,
    images = document.querySelectorAll(".banner img")

max = images.length;
function nextImage() {
    images[currentImageIndex].classList.remove("selected")
    currentImageIndex++

    if (currentImageIndex >= max)
        currentImageIndex = 0

    images[currentImageIndex]
        .classList.add("selected")
}

function start() {
    setInterval(() => {

        nextImage()
    }, time)
}
window.addEventListener("load", start)
let marketKey = 0
let quantInstruments = 1
let cart = []

const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
const formatoMonetario = (valor) => {
    if (valor) {
        return valor.toFixed(2)
    }
}
const abrirModal = () => {
    seleciona('.instrumentsWindowArea').style.opacity = 0
    seleciona('.instrumentsWindowArea').style.display = 'flex'

    setTimeout(() => seleciona('.instrumentsWindowArea').style.opacity = 1, 150)
}
const fecharModal = () => {
    seleciona('.instrumentsWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.instrumentsWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.instrumentsInfo-cancelButton, .instrumenstInfo-cancelMobileButton').forEach((item) => item.addEventListener('click', fecharModal))
}

const preencheDadosDasPizzas = (instrumentsItem, item, index) => {

    instrumentsItem.setAttribute('data-key', index)
    instrumentsItem.querySelector('.music-item-img img').src = item.img
    instrumentsItem.querySelector('.music-item-price').innerHTML = formatoReal(item.price[2])
    instrumentsItem.querySelector('.music-item-name').innerHTML = item.name
    instrumentsItem.querySelector('.music-item-desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.profInstrument img').src = item.img
    seleciona('.instrumentsInfo h1').innerHTML = item.name
    seleciona('.instrumentsInfo-desc').innerHTML = item.description
    seleciona('.instrumentsInfo-actualPrice').innerHTML = formatoReal(item.price[2])
}
const pegarKey = (e) => {

    let key = e.target.closest('.music-item').getAttribute('data-key')
    quantInstruments = 1
    marketKey = key
    return key
}

const preencherTamanhos = (key) => {
    seleciona('.instrumentsInfo-style.selected').classList.remove('selected')

    // selecionar todos os tamanhos
    selecionaTodos('.instrumentsInfo-style').forEach((style, styleIndex) => {

        (styleIndex == 2) ? style.classList.add('selected') : ''
        style.querySelector('span').innerHTML = instrumentsJson[key].style[styleIndex]
    })
}
const escolherTamanhoPreco = (key) => {
    selecionaTodos('.instrumentsInfo-style').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            seleciona('.instrumentsInfo-style.selected').classList.remove('selected')

            size.classList.add('selected')
            seleciona('.instrumentsInfo-actualPrice').innerHTML = formatoReal(instrumentsJson[key].price[sizeIndex])
        })
    })
}
const mudarQuantidade = () => {
    seleciona('.instrumentsInfo-qtmais').addEventListener('click', () => {
        quantInstruments++
        seleciona('.instrumentsInfo-qt').innerHTML = quantInstruments
    })
    seleciona('.instrumentsInfo-qtmenos').addEventListener('click', () => {
        if (quantInstruments > 1) {
            quantInstruments--
            seleciona('.instrumentsInfo-qt').innerHTML = quantInstruments
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.instrumentsInfo-addButton').addEventListener('click', () => {

        let style = seleciona('.instrumentsInfo-style.selected').getAttribute('data-key')

        let price = seleciona('.instrumentsInfo-actualPrice').innerHTML.replace('R$&nbsp;', '')
        let identificador = instrumentsJson[marketKey].id + 't' + style
        let key = cart.findIndex((item) => item.identificador == identificador)
        if (key > -1) {
            cart[key].qt += quantInstruments
        } else {
            let instrument = {
                identificador,
                id: instrumentsJson[marketKey].id,
                style,
                qt: quantInstruments,
                price: parseFloat(price)
            }
            cart.push(instrument)
        }
        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    if (cart.length > 0) {
        seleciona('aside').classList.add('show')
    }
    seleciona('.menu-openner').addEventListener('click', () => {
        if (cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    seleciona('.menu-openner span').innerHTML = cart.length

    if (cart.length > 0) {
        seleciona('aside').classList.add('show')
        seleciona('.cart').innerHTML = ''
        let subtotal = 0
        let desconto = 0
        let total = 0

        for (let i in cart) {
            let instrumentsItem = instrumentsJson.find((item) => item.id == cart[i].id)
            subtotal += cart[i].price * cart[i].qt
            let cartItem = seleciona('.center-market .cart-item').cloneNode(true)
            seleciona('.cart').append(cartItem)
            let instrumentStyleName = cart[i].style

            let instrumentName = `${instrumentsItem.name} (${instrumentStyleName})`
            cartItem.querySelector('img').src = instrumentsItem.img
            cartItem.querySelector('.cart-item-name').innerHTML = instrumentName
            cartItem.querySelector('.cart-item-qt').innerHTML = cart[i].qt

            cartItem.querySelector('.cart-item-qtmais').addEventListener('click', () => {
                cart[i].qt++
                atualizarCarrinho()
            })

            cartItem.querySelector('.cart-item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--
                } else {

                    cart.splice(i, 1)
                }

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''
                atualizarCarrinho()
            })

            seleciona('.cart').append(cartItem)

        }

        desconto = subtotal * 0
        total = subtotal - desconto

        seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
        seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
        seleciona('.total span:last-child').innerHTML = formatoReal(total)

    } else {
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
    }
}

const finalizarCompra = () => {
    seleciona('.cart-finalizar').addEventListener('click', () => {
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'grid'
    })
}

instrumentsJson.map((item, index) => {
    let instrumentsItem = document.querySelector('.center-market .music-item').cloneNode(true)
    seleciona('.market-area').append(instrumentsItem)

    preencheDadosDasPizzas(instrumentsItem, item, index)
    instrumentsItem.querySelector('.music-item a').addEventListener('click', (e) => {
        e.preventDefault()
        let chave = pegarKey(e)

        abrirModal()
        preencheDadosModal(item)
        preencherTamanhos(chave)

        seleciona('.instrumentsInfo-qt').innerHTML = quantInstruments
        escolherTamanhoPreco(chave)

    })
    botoesFechar()
})

mudarQuantidade()
adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()

