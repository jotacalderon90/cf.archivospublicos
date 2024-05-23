for (module in app.modules) {
	app.modules[module] = new app.modules[module]();
}
Vue.createApp({
    data() {
        return {
            ...app.modules,
            loader: false,
            mounthed: async function() {
                this.loader = true;
				for (module in app.modules) {
					if (this[module].start) {
						await this[module].start(this);
					}
				}
                this.loader = false;
            }
        }
    },
    mounted() {this.mounthed()}
}).mount("#app");