sap.ui.define(["./BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"./messages",
		"sap/ui/export/Spreadsheet"
	],
	function (BaseController, JSONModel, Filter,FilterOperator, MessageToast, MessageBox, messages, Spreadsheet) {
		"use strict";
		return BaseController.extend("MASTER.MasterCustomer.controller.CustomerDisplay", {
			onInit: function () {
				this._JSONModel = this.getModel();
			},
			handleSearch: function () {
				this.setBusy(true);
				var aFilters = [];
				var Sel = this._JSONModel.getProperty("/Sel");
				if (Sel.SalesOrganizationS === "") {
					MessageToast.show(this.getModel("i18n").getResourceBundle().getText("Mes1"));
					this.setBusy(false);
					return;
				}
				if (Sel.CustomerS !== "" & Sel.CustomerE === "") {
					var oFilter1 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.EQ, Sel.CustomerS);
					aFilters.push(oFilter1);
				}
				if (Sel.CustomerS !== "" & Sel.CustomerE !== "") {
					var oFilter1 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.BT, Sel.CustomerS, Sel.CustomerE);
					aFilters.push(oFilter1);
				}
				if (Sel.CustomerS === "" & Sel.CustomerE !== "") {
					var oFilter1 = new sap.ui.model.Filter("Customer", sap.ui.model.FilterOperator.EQ, Sel.CustomerE);
					aFilters.push(oFilter1);
				}
				if (Sel.SalesOrganizationS !== "" & Sel.SalesOrganizationE === "") {
					var oFilter2 = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, Sel.SalesOrganizationS);
					aFilters.push(oFilter2);
				}
				if (Sel.SalesOrganizationS === "" & Sel.SalesOrganizationE !== "") {
					var oFilter2 = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.EQ, Sel.SalesOrganizationE);
					aFilters.push(oFilter2);
				}
				if (Sel.SalesOrganizationS !== "" & Sel.SalesOrganizationE !== "") {
					var oFilter2 = new sap.ui.model.Filter("SalesOrganization", sap.ui.model.FilterOperator.BT, Sel.SalesOrganizationS, Sel.SalesOrganizationE);
					aFilters.push(oFilter2);
				}

				if (Sel.CompanyCodeS !== "" & Sel.CompanyCodeE === "") {
					var oFilter3 = new sap.ui.model.Filter("CompanyCode", sap.ui.model.FilterOperator.EQ, Sel.CompanyCodeS);
					aFilters.push(oFilter3);
				}
				if (Sel.CompanyCodeS === "" & Sel.CompanyCodeE !== "") {
					var oFilter3 = new sap.ui.model.Filter("CompanyCode", sap.ui.model.FilterOperator.EQ, Sel.CompanyCodeE);
					aFilters.push(oFilter3);
				}
				if (Sel.CompanyCodeS !== "" & Sel.CompanyCodeE !== "") {
					var oFilter3 = new sap.ui.model.Filter("CompanyCode", sap.ui.model.FilterOperator.BT, Sel.CompanyCodeS, Sel.CompanyCodeE);
					aFilters.push(oFilter3);
				}

				// if (Sel.PersonNumberS !== "" & Sel.PersonNumberE === "") {
				// 	var oFilter4 = new sap.ui.model.Filter("PersonNumber", sap.ui.model.FilterOperator.EQ, Sel.PersonNumberS);
				// 	aFilters.push(oFilter4);
				// }
				// if (Sel.PersonNumberS === "" & Sel.PersonNumberE !== "") {
				// 	var oFilter4 = new sap.ui.model.Filter("PersonNumber", sap.ui.model.FilterOperator.EQ, Sel.PersonNumberE);
				// 	aFilters.push(oFilter4);
				// }
				// if (Sel.PersonNumberS !== "" & Sel.PersonNumberE !== "") {
				// 	var oFilter4 = new sap.ui.model.Filter("PersonNumber", sap.ui.model.FilterOperator.BT, Sel.CREATEDATES, Sel.PersonNumberE);
				// 	aFilters.push(oFilter4);
				// }
				var mParameters = {
					filters: aFilters,
					success: function (oData) {
						var Arry = !oData ? [] : oData.results;
						var CustomerFilters = [];
						var BusinessPartnerFilter = [];
						var PaymentTermsFilters = [];
						var sFilter = [];
						var sFilter1 = [];
						var sFilter2 = [];
						var sFilter5 = [];
						if (Arry.length === 0) {
							MessageToast.show("查詢無數據！");
							this.setBusy(false);
							return;
						}
						for (var i = Arry.length - 1; i >= 0; i--) {
							if (Arry[i].SalesOrganization !== Arry[i].CompanyCode) {
								if (Arry[i].SalesOrganization !== "" & Arry[i].CompanyCode !== "") {
									Arry.splice(i, 1);
								}
							} else {
								if (Arry[i].Customer !== "") {
									CustomerFilters.push(new Filter({
										path: "Customer",
										operator: FilterOperator.EQ,
										value1: Arry[i].Customer
									}));
									BusinessPartnerFilter.push(new Filter({
										path: "BusinessPartner",
										operator: FilterOperator.EQ,
										value1: Arry[i].Customer
									}));
								}
								if (Arry[i].PaymentTerms !== "") {
									PaymentTermsFilters.push(new Filter({
										path: "CustomerPaymentTerms",
										operator: FilterOperator.EQ,
										value1: Arry[i].PaymentTerms
									}));
								}
							}
						}
						if (CustomerFilters.length > 0) {
							sFilter1.push(new Filter({
								filters: CustomerFilters,
								and: false
							}));
						}
						if (BusinessPartnerFilter.length > 0) {
							sFilter2.push(new Filter({
								filters: BusinessPartnerFilter,
								and: false
							}));
						}
						if (PaymentTermsFilters.length > 0) {
							sFilter.push(new Filter({
								filters: PaymentTermsFilters,
								and: false
							}));
						}
						if (CustomerFilters.length > 0) {
							sFilter5.push(new Filter({
								filters: CustomerFilters,
								and: false
							}));
						}
						// this.setBusy(false);
						this.getBusinessPartner(sFilter1);
						this.getSalesMan(sFilter5);
						this.getPaymentTermsName(sFilter);
						this.getBusinessPartnerAddress(sFilter2);
						this._JSONModel.setProperty("/CustomerList", Arry);
					}.bind(this),
					error: function (oError) {
						MessageToast.show("查詢無數據！");
						this.setBusy(false);
						return;
					}.bind(this)
				};
				this.getModel("CUSTOMER").read("/YY1_MASTER_CUSTOMER", mParameters);
			},
			getBusinessPartner: function (sFilter1) {
				var mParameters = {
					filters: sFilter1,
					success: function (oData) {
						var Arry = !oData ? [] : oData.results;
						var CustomerList = this._JSONModel.getData().CustomerList;
						if (Arry.length > 0) {
							for (var i = 0; i < CustomerList.length; i++) {
								for (var n = 0; n < Arry.length; n++) {
									if (CustomerList[i].Customer === Arry[n].BusinessPartner) {
										CustomerList[i].CustomerName = Arry[n].OrganizationBPName1 + "" + Arry[n].OrganizationBPName2 + "" + Arry[n].OrganizationBPName3;
										CustomerList[i].SortField = Arry[n].SearchTerm1;

									}
								}
							}
							this._JSONModel.setProperty("/CustomerList", CustomerList);
							this._JSONModel.setProperty("/BusinessPartner", Arry);
							this.setBusy(false);
						}
					}.bind(this),
					error: function (oError) {
						MessageToast.show("查詢無數據！");
						this.setBusy(false);
						return;
					}.bind(this)
				};
				this.getModel("BUSINESSPARTNER").read("/A_BusinessPartner", mParameters);

			},
			getBusinessPartnerAddress: function (sFilter2) {
				var mParameters = {
					filters: sFilter2,
					success: function (oData) {
						var Arry = !oData ? [] : oData.results;
						var CustomerList = this._JSONModel.getData().CustomerList;
						var PartnerFilter = [];
						var AddressIDFilter = [];
						var sFilter3 = [];
						var sFilter4 = [];
						if (Arry.length > 0) {
							for (var i = 0; i < Arry.length; i++) {
								if (Arry[i].AddressID !== "") {
									AddressIDFilter.push(new Filter({
										path: "AddressID",
										operator: FilterOperator.EQ,
										value1: Arry[i].AddressID
									}));
								}
								if (Arry[i].BusinessPartner !== "") {
									PartnerFilter.push(new Filter({
										path: "BusinessPartner",
										operator: FilterOperator.EQ,
										value1: Arry[i].BusinessPartner
									}));
								}
							}
							for (var i = 0; i < CustomerList.length; i++) {
								for (var n = 0; n < Arry.length; n++) {
									if (CustomerList[i].Customer === Arry[n].BusinessPartner) {
										CustomerList[i].CO = Arry[n].CareOfName;
										CustomerList[i].CompanyAddress = Arry[n].StreetPrefixName + "" + Arry[n].AdditionalStreetPrefixName + "" + Arry[n].StreetName +
											"" + Arry[n].StreetSuffixName + "" + Arry[n].CityName;
									}
								}
							}
						}
						if (AddressIDFilter.length > 0) {
							sFilter3.push(new Filter({
								filters: AddressIDFilter,
								and: false
							}));
						}
						if (PartnerFilter.length > 0) {
							sFilter4.push(new Filter({
								filters: PartnerFilter,
								and: false
							}));
						}
						this._JSONModel.setProperty("/CustomerList", CustomerList);
						this._JSONModel.setProperty("/Address", Arry);
						this.getPhoneNumber(sFilter3);
						this.getMail(sFilter3);
						this.getTaxNumber(sFilter4);
					}.bind(this),
					error: function (oError) {
						MessageToast.show("查詢無數據！");
						this.setBusy(false);
						return;
					}.bind(this)
				};
				this.getModel("BUSINESSPARTNER").read("/A_BusinessPartnerAddress", mParameters);
			},
			//获取电话号码
			getPhoneNumber: function (sFilter3) {
				var mParameters = {
					filters: sFilter3,
					success: function (oData) {
						var CustomerList = this._JSONModel.getData().CustomerList;
						var Address = this._JSONModel.getData().Address;
						var Arry = !oData ? [] : oData.results;
						if (Arry.length > 0) {
							for (var i = 0; i < Address.length; i++) {
								for (var n = 0; n < Arry.length; n++) {
									if (Address[i].AddressID === Arry[n].AddressID) {
										if (Arry[n].PhoneNumberType === "3") {
											Address[i].MobilePhone = Arry[n].PhoneNumber;
										} else if (Arry[n].PhoneNumberType === "1") {
											Address[i].Telephone1 = Arry[n].PhoneNumber;
										} else {
											Address[i].Telephone2 = Arry[n].PhoneNumber;
										}
									}
								}
							}
							for (var i = 0; i < CustomerList.length; i++) {
								for (var n = 0; n < Address.length; n++) {
									if (CustomerList[i].Customer === Address[n].BusinessPartner) {
										CustomerList[i].Telephone1 = Address[n].Telephone1;
										CustomerList[i].Telephone2 = Address[n].Telephone2;
										CustomerList[i].MobilePhone = Address[n].MobilePhone;
									}
								}
							}
							this._JSONModel.setProperty("/CustomerList", CustomerList);
							this._JSONModel.setProperty("/Address", Address);
							this._JSONModel.setProperty("/PhoneNumber", Arry);
						}
					}.bind(this),
					error: function (oError) {
						MessageToast.show("查詢無數據！");
						this.setBusy(false);
						return;
					}.bind(this)
				};
				this.getModel("BUSINESSPARTNER").read("/A_AddressPhoneNumber", mParameters);
			},
			//获取邮箱地址
			getMail: function (sFilter3) {
				var mParameters = {
					filters: sFilter3,
					success: function (oData) {
						var Arry = !oData ? [] : oData.results;
						var CustomerList = this._JSONModel.getData().CustomerList;
						var Address = this._JSONModel.getData().Address;
						if (Arry.length > 0) {
							for (var i = 0; i < Address.length; i++) {
								for (var n = 0; n < Arry.length; n++) {
									if (Address[i].AddressID === Arry[n].AddressID) {
										if (Arry[n].OrdinalNumber === "1") {
											Address[i].Mail1 = Arry[n].EmailAddress;
										} else if (Arry[n].OrdinalNumber === "2") {
											Address[i].Mail2 = Arry[n].EmailAddress;
										}
									}
								}
							}
							for (var i = 0; i < CustomerList.length; i++) {
								for (var n = 0; n < Address.length; n++) {
									if (CustomerList[i].Customer === Address[n].BusinessPartner) {
										CustomerList[i].Mail1 = Address[n].Mail1;
										CustomerList[i].Mail2 = Address[n].Mail2;
									}
								}
							}
							this._JSONModel.setProperty("/CustomerList", CustomerList);
							this._JSONModel.setProperty("/Mail", Arry);
						}
					}.bind(this),
					error: function (oError) {
						this.setBusy(false);
						return;
					}.bind(this)
				};
				this.getModel("BUSINESSPARTNER").read("/A_AddressEmailAddress", mParameters);
			},
			//获取税号
			getTaxNumber: function (sFilter4) {
				var mParameters = {
					filters: sFilter4,
					success: function (oData) {
						var Arry = !oData ? [] : oData.results;
						var CustomerList = this._JSONModel.getData().CustomerList;
						if (Arry.length > 0) {
							for (var i = 0; i < CustomerList.length; i++) {
								for (var n = 0; n < Arry.length; n++) {
									if (CustomerList[i].Customer === Arry[n].BusinessPartner) {
										if (CustomerList[i].CompanyCode === "6310") {
											CustomerList[i].TaxNumber = Arry[n].BPTaxNumber;
										} else if (CustomerList[i].CompanyCode === "1310") {
											CustomerList[i].TaxNumber = Arry[n].BPTaxLongNumber;
										}
									}
								}
							}
							this._JSONModel.setProperty("/TaxNumber", Arry);
							this._JSONModel.setProperty("/CustomerList", CustomerList);
							this.setBusy(false);
						}
					}.bind(this),
					error: function (oError) {
						this.setBusy(false);
						return;
					}.bind(this)
				};
				this.getModel("BUSINESSPARTNER").read("/A_BusinessPartnerTaxNumber", mParameters);
			},
			//获取业务用户
			getSalesMan: function (sFilter) {
				sFilter.push(new Filter({
					path: "PartnerFunction",
					operator: FilterOperator.EQ,
					value1: "VE"
				}));
				var mParameters = {
					filters: sFilter,
					success: function (oData) {
						var Arry = !oData ? [] : oData.results;
						var CustomerList = this._JSONModel.getData().CustomerList;
						if (Arry.length !== 0) {
							for (var i = 0; i < CustomerList.length; i++) {
								for (var n = 0; n < Arry.length; n++) {
									if (CustomerList[i].Customer === Arry[n].Customer) {
										CustomerList[i].PersonNumber = Arry[n].PersonWorkAgreement;
										CustomerList[i].PersonNumberName = Arry[n].PersonFullName;
									}
								}
							}
							this._JSONModel.setProperty("/CustomerList", CustomerList);
						}
						// this.setBusy(false);
					}.bind(this),
					error: function (oError) {
						this.setBusy(false);
					}.bind(this),
				};
				this.getModel("SALESMAN").read("/YY1_Saleman", mParameters);
			},
			//获取付款描述
			getPaymentTermsName: function (sFilter) {
				var sLanguage = sap.ui.getCore().getConfiguration().getLanguage();
				switch (sLanguage) {
				case "zh-Hant":
				case "zh-TW":
					sLanguage = "ZF";
					break;
				case "zh-Hans":
				case "zh-CN":
					sLanguage = "ZH";
					break;
				case "EN":
				case "en":
					sLanguage = "EN";
					break;
				default:
					break;
				}
				sFilter.push(new Filter({
					path: "Language",
					operator: FilterOperator.EQ,
					value1: sLanguage
				}));
				var mParameters = {
					filters: sFilter,
					success: function (oData) {
						var Arry = !oData ? [] : oData.results;
						var CustomerList = this._JSONModel.getData().CustomerList;
						if (Arry.length !== 0) {
							for (var i = 0; i < CustomerList.length; i++) {
								for (var n = 0; n < Arry.length; n++) {
									if (CustomerList[i].PaymentTerms === Arry[n].CustomerPaymentTerms) {
										CustomerList[i].PaymentTermsName = Arry[n].CustomerPaymentTermsName;
									}
								}
							}
							this._JSONModel.setProperty("/CustomerList", CustomerList);
						}
						// this.setBusy(false);
					}.bind(this),
					error: function (oError) {
						this.setBusy(false);
					}.bind(this),
				};
				this.getModel("CUSTOMERPAYMENTTERMS").read("/YY1_CustomerPaymentTerms", mParameters);
			},
			handleDownload: function () {
				var aCols = [];
				var aCol; // 根据id值获取table 
				var oTable = this.getView().byId("DisplayTable"); // 获取table的绑定路径
				var sPath = oTable.getBindingPath("rows"); // 根据路径获取到数据源
				var excelSet = this._JSONModel.getProperty(sPath) ? this._JSONModel.getProperty(sPath) : [];
				// 如果没有数据则报错并return
				if (excelSet.length == 0) {
					messages.showText("没有可以导出的数据");
					return;
				}
				// 获取table列的集合
				var columns = oTable.getColumns();
				// 循环columns设置excel抬头的相关参数
				for (var i = 0; i < columns.length; i++) {
					if (columns[i].getVisible()) {
						aCol = {
							// 获取表格的列名，即设置excel的抬头
							label: columns[i].getAggregation("label").getText(),
							// 数据类型，即设置excel该列的数据类型
							type: 'string',
							// 获取数据的绑定路径，即设置excel该列的字段路径
							property: columns[i].getAggregation("template").getBindingPath("text"),
							// 获取表格的width属性，即设置excel该列的长度
							width: parseFloat(columns[i].getWidth())
						};
						aCols.push(aCol);
					}
				}
				// 设置excel的相关属性
				var oSettings = {
					workbook: {
						columns: aCols,
						context: {
							application: 'Debug Test Application',
							version: '1.54',
							title: 'Some random title',
							modifiedBy: 'John Doe',
							metaSheetName: 'Custom metadata',
							hierarchyLevel: 'level'
						}
					},
					dataSource: excelSet,
					// 传入参数，数据源
					fileName: "客户主数据.xlsx" // 文件名，需要加上后缀
				};
				new Spreadsheet(oSettings).build().then(function () {
					messages.showText("Excel 导出完毕 !");
				});
			}
		});
	});