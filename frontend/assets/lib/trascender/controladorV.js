for (module in app.modules) {
	app.modules[module] = new app.modules[module]();
}
Vue.createApp({
    data() {
        return {
            ...app.modules,
            loader: { active: false, title: ''},
            mounthed: async function() {
                this.loader.active = true;
				for (module in app.modules) {
					if (this[module].start) {
						await this[module].start(this);
					}
				}
                this.loader.active = false;
            }
        }
    },
    mounted() {this.mounthed()}
}).mount("#app");