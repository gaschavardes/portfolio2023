import { Quaternion } from 'three'

const _q = new Quaternion()

export default function copyObjectDataTransforms(object, data) {
	if (!data) {
		console.error(`Data not found for object: ${object}`)
		return
	}

	if (object.isBufferGeometry) {
		if (data[1]) object.applyQuaternion(_q.set(data[1][0], data[1][1], data[1][2], data[1][3]))
		if (data[0]) object.translate(data[0][0], data[0][1], data[0][2])
		if (data[2]) object.scale(data[2][0], data[2][1], data[2][2])
	} else {
		if (data[0]) object.position.set(data[0][0], data[0][1], data[0][2])
		if (data[1]) object.rotation.setFromQuaternion(_q.set(data[1][0], data[1][1], data[1][2], data[1][3]))
		if (data[2]) object.scale.set(data[2][0], data[2][1], data[2][2])
	}
}