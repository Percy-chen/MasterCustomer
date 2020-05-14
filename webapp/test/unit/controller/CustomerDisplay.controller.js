/*global QUnit*/

sap.ui.define([
	"MASTER/MasterCustomer/controller/CustomerDisplay.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CustomerDisplay Controller");

	QUnit.test("I should test the CustomerDisplay controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});