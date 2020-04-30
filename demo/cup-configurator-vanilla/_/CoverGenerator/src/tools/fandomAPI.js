// import CryptoJS from 'crypto-js'
import fetch    from 'node-fetch'

let urlBase = 'https://nekowiztw.github.io/cardFinder/json/cardData.json'

export default {
    fetchList() {
        return fetch(urlBase)
            .then(res => res.json())
            .then(json => {
                let list = []
                json.card.forEach(card => {
                    if (card.name.length === 0) return
                    list.push({
                        id: parseInt(card.id),
                        text: card.id + ' - ' + card.name,
                        value: card.small_filename
                    })
                })
                return list
            })
    }
}

