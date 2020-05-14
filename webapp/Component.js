sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"MASTER/MasterCustomer/model/models",
	"sap/ui/model/json/JSONModel",
	"sap/m/library",
	"sap/m/MessageToast"
], function (UIComponent, Device, models, JSONModel, MobileLibrary, MessageToast) {
	"use strict";

	return UIComponent.extend("MASTER.MasterCustomer.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createLocalModel());
			this._JSONModel = this.getModel();
		}
	});
});