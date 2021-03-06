class Lightbox {
    static init() {
        const gallerySection = document.querySelector(".photographies__liste");
        const links = Array.from(gallerySection.querySelectorAll('img[src$=".jpg"],source[src$=".mp4"]'));
        const gallery = links.map((link) => link.getAttribute("src"));
        links.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                new Lightbox(e.currentTarget.getAttribute("src"), gallery, e.currentTarget.getAttribute("alt"));
            });
            link.addEventListener("keyup", (e) => {
                if (e.code === "Enter") {
                    e.preventDefault();
                    new Lightbox(e.currentTarget.getAttribute("src"), gallery, e.currentTarget.getAttribute("alt"));
                }
            });
        });
    }
    
    constructor(url, gallery, alt) {
		this.element = this.buildDOM(url, alt);
		this.gallery = gallery;
		this.loadMedia(url, alt, gallery);
		this.onKeyUp = this.onKeyUp.bind(this);
		document.body.appendChild(this.element);
		document.addEventListener("keyup", this.onKeyUp);
	}


    loadMedia(url, alt) {
		this.url = url;
        console.log(alt);
		this.alt = alt;
		if (url.endsWith(".mp4")) {
			const video = document.createElement("video");
			const container = this.element.querySelector(".lightbox__contenu__figure");
			const legend = document.createElement("figcaption");
			legend.innerHTML += this.alt;
            legend.classList.add("lightbox__contenu__figcaption");
			container.innerHTML = "";
			container.appendChild(video);
			container.appendChild(legend);
			video.setAttribute("controls", "");
			video.src = url;
		} else if (url.endsWith(".jpg")) {
			const image = new Image();
			const container = this.element.querySelector(".lightbox__contenu__figure");
			const legend = document.createElement("figcaption");
            legend.classList.add("lightbox__contenu__figcaption");
			legend.innerHTML += this.alt;
			container.innerHTML = "";
			container.appendChild(image);
			container.appendChild(legend);
			image.alt = this.alt;
			image.src = this.url;
			image.classList.add("lightbox__contenu__media");
		}
	}

    getFormatedAlt(path) 
    {
		const splitedPath = path.split("/");
		const string = splitedPath[splitedPath.length - 1].split(".")[0];
		const formatedTitle = string.replaceAll("_", " ");
		return formatedTitle;
	}

    onKeyUp(e) {
		if (e.key === "Escape") {
			this.close(e);
		} else if (e.key === "ArrowRight") {
			this.next(e);
		} else if (e.key === "ArrowLeft") {
			this.previous(e);
		}
	}

    close(e) {
		e.preventDefault();
		this.element.classList.add("lightbox__fadeOut");
		window.setTimeout(() => {
			this.element.parentElement.removeChild(this.element);
		}, 500);
		document.removeEventListener("keyup", this.onKeyUp);
	}

    next(e) {
		e.preventDefault();
		let i = this.gallery.findIndex((image) => image === this.url);
		if (i === this.gallery.length - 1) {
			i = -1;
		}
		this.loadMedia(this.gallery[i + 1]);
	}

    previous(e) {
		e.preventDefault();
		let i = this.gallery.findIndex((image) => image === this.url);
		if (i === 0) {
			i = this.gallery.length;
		}
		this.loadMedia(this.gallery[i - 1]);
	}

    buildDOM() {
		const dom = document.createElement("div");
		dom.classList.add("lightbox");
		dom.innerHTML = `<div class="lightbox__contenu">
                     <a class="lightbox__contenu__fleche prev"><i class="fas fa-chevron-left"></i></a>
                     <figure class="lightbox__contenu__figure">
                     </figure>
                 <button class="lightbox__contenu__croix"><i class="fas fa-times"></i></button>
                 <a class="lightbox__contenu__fleche next"><i class="fas fa-chevron-right"></i></a>
             </div>`;
		dom.querySelector(".lightbox__contenu__croix").addEventListener("click", this.close.bind(this));
		dom.querySelector(".next").addEventListener("click", this.next.bind(this));
		dom.querySelector(".prev").addEventListener("click", this.previous.bind(this));
		return dom;
	}
}