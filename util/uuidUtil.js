/*
Copyright 2021 Maciej Januś

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation 
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, 
modify, merge, publish, distribute, sublicense, and/or 
sell copies of the Software, and to permit persons to
whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*
Copyright 2021 Maciej Januś

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation 
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, 
modify, merge, publish, distribute, sublicense, and/or 
sell copies of the Software, and to permit persons to
whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const centra = require('centra')

module.exports = async (p1, p2) => {
	const targetType = (p2 ? p1 : 'uuid')
	const identifier = (p2 ? p2 : p1)

	let targetUUID = (targetType === 'uuid' ? identifier : null)

	if (targetType === 'name') {
		console.log(targetType, identifier)
		let playerResolution = await centra(`https://api.mojang.com/users/profiles/minecraft/${identifier}`, 'GET').send()

		if (playerResolution.statusCode === 200) {
			let body
			try {
				body = JSON.parse(playerResolution.body)

				if (typeof(body) !== 'object') throw `API Response should be "Object", received ${typeof(body)} instead`
			}
			catch (err) {
				console.log(err)
				console.log(body)
				throw new Error('Invalid response recieved from Mojang.')
			}
			targetUUID = body.id
			if (targetUUID) {
				targetUUID = body.id
			}
			else {
				throw new Error(`Player doesn't exist.`)
			}
		}
		else {
            //console.log(playerResolution)
			throw new Error('Unexpected HTTP code from Mojang.')
		}
	}

	return targetUUID
}