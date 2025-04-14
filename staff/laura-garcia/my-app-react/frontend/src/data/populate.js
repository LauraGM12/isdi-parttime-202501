const imgArray = [
    'https://i1.sndcdn.com/avatars-v2z8bpwzzVI4znuX-3eyJ8g-t1080x1080.jpg',
    'https://m.media-amazon.com/images/I/61LBUV9giLL._AC_UF1000,1000_QL80_.jpg',
    'https://img.freepik.com/vector-gratis/gorra-cumpleanos-confeti-explosion-serpentina_1017-17924.jpg',
    'https://a.pinatafarm.com/620x412/6fd302e9f8/satisfied-seal.jpg',
    'https://pbs.twimg.com/media/Gg4Jv6dXQAA-k7w.jpg',
    'https://i.pinimg.com/1200x/b1/24/de/b124dea96cb18aff9471b93a60cd072e.jpg',
]

const randomDate = (start, end, startHour, endHour) => {
    const date = new Date(+start + Math.random() * (end - start))
    const hour = startHour + Math.random() * (endHour - startHour) | 0
    date.setHours(hour)
    return date
}

const data = {
    users: [
        {
            id: Date.now(),
            username: "DinoPercy",
            email: "percy@mail.com",
            avatar: "https://img.freepik.com/vector-gratis/lindo-dinosaurio-vacaciones-verano-dibujos-animados-vector-icono-ilustracion-concepto-icono-vacaciones-animales-aislado_138676-6764.jpg",
            password: "12345Aa!",
            bio: "Sleepy cute lazy dog."
        },
        {
            id: Date.now() + 1,
            username: "DrCosmo",
            email: "cosmo@mail.com",
            avatar: "https://artyourcat.com/cdn/shop/files/Personalized_Male_Doctor_Cat_Artwork.jpg",
            password: "12345Aa!",
            bio: "I could be a DJ if I wasn't so fancy!"
        },
        {
            id: Date.now() + 2,
            username: "Baldeer",
            email: "baldeer@mail.com",
            avatar: "https://nortedigital.mx/wp-content/uploads/2015/06/base_image1.jpg",
            password: "12345Aa!",
            bio: undefined
        },
        {
            id: Date.now() + 3,
            username: "Hiro",
            email: "hiro@mail.com",
            avatar: "https://miiveiart.com/cdn/shop/products/stickerblackcatslick.png",
            password: "12345Aa!",
            bio: "Miau! Miau miau miau miau miau, miau?"
        }
    ]
}

const generatePost = (index) => {
    let post = {}
    post.id = Date.now() + index
    post.createdOn = randomDate(new Date('01/01/2025'), new Date(), 1, 24)
    post.author = data.users[Math.floor(Math.random() * data.users.length)].id
    post.likes = data.users.filter(() => Math.random() > 0.5).map(user => user.id)
    post.title = `Post ${index}`
    post.description = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Est dignissimos minus, nostrum placeat autem sed eos at, in ducimus voluptas necessitatibus perspiciatis nemo laudantium mollitia illum aliquid nobis maiores assumenda!`
        .slice(0, Math.floor(Math.random() * 210) + 1)
    post.img = Math.random() > 0.5 ? imgArray[Math.floor(Math.random() * imgArray.length)] : undefined
    return post
}

const POSTS_LENGTH = 15

data.posts = new Array(POSTS_LENGTH).fill(null).map((_, index) => generatePost(index))

localStorage.clear()
sessionStorage.clear()

localStorage.setItem('users', JSON.stringify(data.users))
localStorage.setItem('posts', JSON.stringify(data.posts))