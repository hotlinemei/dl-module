'use strict';

var should = require('should');
var helper = require("../helper");
var PurchaseOrderGroupManager = require("../../src/managers/po/purchase-order-group-manager");
var instanceManager = null;

function getData() {
    var PurchaseOrderGroup = require('dl-models').po.PurchaseOrderGroup;
    var PurchaseOrder = require('dl-models').po.PurchaseOrder;
    var PurchaseOrderItem = require('dl-models').po.PurchaseOrderItem;
    var Supplier = require('dl-models').core.Supplier;
    var UoM = require('dl-models').core.UoM;
    var Product = require('dl-models').core.Product;

    var now = new Date();
    var stamp = now / 1000 | 0;
    var code = stamp.toString(36);
    
    var purchaseOrderGroup = new PurchaseOrderGroup();
    purchaseOrderGroup.PODLNo = '1' + code + stamp;
    
    var purchaseOrder = new PurchaseOrder();
    purchaseOrder.RONo = '1' + code + stamp;
    purchaseOrder.PRNo = '2' + code + stamp;
    purchaseOrder.PONo = '3' + code + stamp;

    var _supplier = new Supplier({
        code: '123',
        name: 'hot',
        description: 'hotline',
        phone: '0812....',
        address: 'test',
        local: true
    });

    var _uom = new UoM({
        unit: `Meter`
    });

    var product = new Product({
        code: '22',
        name: 'hotline',
        price: 0,
        description: 'hotline123',
        UoM: _uom,
        detail: {}
    });

    var productValue = new PurchaseOrderItem({
        quantity: 10,
        price: 10000,
        description: 'test desc',
        dealQuantity: 10,
        dealMeasurement: 'Meter',
        defaultQuantity: 1000,
        defaultMeasurementQuantity: 'Centimeter',
        product: product
    });
    
    var _products = [];
    _products.push(productValue);

    purchaseOrder.items = _products;
    
    var _purchaseOrders = [];
    _purchaseOrders.push(purchaseOrder);
    
    purchaseOrderGroup.items = _purchaseOrders
    purchaseOrderGroup.usePPn = true;
    purchaseOrderGroup.usePPh = true;
    purchaseOrderGroup.deliveryDate = new Date();
    purchaseOrderGroup.termOfPayment = 'Cash';
    purchaseOrderGroup.deliveryFeeByBuyer = true;
    purchaseOrderGroup.description = 'SP1';
    purchaseOrderGroup.currency = 'dollar';
    purchaseOrderGroup.paymentDue = 2;
    purchaseOrderGroup.supplierId = {};
    purchaseOrderGroup.supplier = _supplier;
    
    return purchaseOrderGroup;
}

//var supplierID = '57b141c85340483fd07d81b9';

before('#00. connect db', function (done) {
    helper.getDb()
        .then(db => {
            instanceManager = new PurchaseOrderGroupManager(db, {
                username: 'unit-test'
            });
            done();
        })
        .catch(e => {
            done(e);
        })
});

it('#01. should success when read data', function (done) {
    instanceManager.read()
        .then(documents => {
            //process documents
            documents.should.be.instanceof(Array);
            done();
        })
        .catch(e => {
            done(e);
        })
});


var createdId;
it('#02. should success when create new data', function (done) {
    var data = getData();
    instanceManager.create(data)
        .then(id => {
            id.should.be.Object();
            createdId = id;
            done();
        })
        .catch(e => {
            done(e);
        })
});