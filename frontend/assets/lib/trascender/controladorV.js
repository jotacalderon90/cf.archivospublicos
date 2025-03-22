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

/*
Vue.createApp({
    data() {
        return {
            modules: {},
            loader: { active: false, title: '' }
        };
    },
    methods: {
        async initializeModules() {
            this.loader.active = true;

            for (const moduleName in app.modules) {
                const moduleInstance = new app.modules[moduleName]();
                this.modules[moduleName] = moduleInstance;

                if (moduleInstance.start) {
                    await moduleInstance.start(this);
                }
            }

            this.loader.active = false;
        }
    },
    async mounted() {
        await this.initializeModules();
    }
}).mount("#app");*/