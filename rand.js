class Rand {
    rand() {
        let result = new String()

        for (let index = 0; index < 20; index++) {

            let rand = Math.floor(Math.random() * (150 - 10 + 1) + 10);
            let toChar = Math.floor(Math.random() * (3 - 2 + 1) + 2);

            if (rand >= 48 && rand <= 57 && toChar % 2 == 0) {
                result += String.fromCharCode(rand)
            } else if (rand >= 65 && rand <= 90 && toChar % 2 == 1) {
                result += String.fromCharCode(rand)
            } else if (rand >= 97 && rand <= 122 && toChar % 2 == 0) {
                result += String.fromCharCode(rand)
            } else {
                result += String(rand)[0]
            }
        }
        return result
    }
}

module.exports = Rand