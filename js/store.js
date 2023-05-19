import { Vector2 } from 'three'

const store = {
	html: document.documentElement,
	body: document.body,
	window: {
		w: window.innerWidth,
		h: window.innerHeight,
		dpr: window.devicePixelRatio
	},
	isTouch: false,
	isSafari: !!navigator.userAgent.match(/Safari/i) && !navigator.userAgent.match(/Chrome/i),
	isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
	pointer: {
		default: new Vector2(),
		gl: new Vector2(),
		glNormalized: new Vector2(),
		isDragging: false
	},

	/** @type { import("./utils/AssetLoader").default } */
	AssetLoader: null,

	/** @type { import("./utils/GlobalEvents").default } */
	GlobalEvents: null,

	/** @type { import("./WebGL").default } */
	WebGL: null
}

export default store