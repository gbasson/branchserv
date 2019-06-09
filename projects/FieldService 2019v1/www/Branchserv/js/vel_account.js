if (typeof (vel) == "undefined") { vel = { __namespace: true }; }
var accountID;
vel.Account = {
    __namespace: true,

    init: function () {
        //MobileCRM.bridge.enableDebug();
        var self = this;

        //Set the onLoad Function
        MobileCRM.UI.EntityForm.requestObject(
            function (entityForm) {
                self.onLoad(entityForm);
            },
            self.onError,
            this
        );

        //Set the onChange Function
        MobileCRM.UI.EntityForm.onChange(
            function (entityForm) {
                self.onChange(entityForm);
            },
            true,
            this
        );

        //Set the onSave Function
        MobileCRM.UI.EntityForm.onSave(
            function (entityForm) {
                self.onSave(entityForm);
            },
            true,
            this
        );
    },

    //onLoad Function
    onLoad: function (entityForm) {
        //Get AccountID for current entity
        accountID = entityForm.entity.properties["accountid"];
    },

    //onSave Function
    onSave: function (entityForm) {
        // onSave code here
    },

    //onChange Function
    onChange: function (entityForm) {
        // onChange code here
    },

    //Additional custom functions
    createCustomerAsset: function () {

        MobileCRM.UI.EntityForm.requestObject(
            function (entityForm) {

                // Create reference for associated asset account
                var accountID = entityForm.entity.properties["accountid"];

                var referAcct = new MobileCRM.Reference("account", accountID);
                var props = referAcct.properties;

                var asset = new MobileCRM.DynamicEntity.createNew("msdyn_customerasset");
                //var assetName = asset.properties["msdyn_name"] = "TestName";

                // one way to set the reference for account
                asset.properties["msdyn_account"] = referAcct;

                // but also Dynamic entity contains reference, so can be used as lookup
                //  contact.properties["parentcustomerid"] = account;

                asset.save(
                    function (err) {
                        if (!err) {
                            // store the contact id for further use
                            newAssetId = this.id;
                            alert(newAssetId);
                            MobileCRM.bridge.alert("Asset ID: " + newAssetId);

                            //Open new Asset Form
                            MobileCRM.UI.FormManager.showEditDialog("msdyn_customerasset", this.id);
                        }
                        else
                            alert(" An Error Has occurred \n" + err);
                    }, null);
            }
        )
    },

    resetLabel: function () {
        MobileCRM.UI.EntityForm.requestObject(
            function (entityForm) {
                var detailView = entityForm.getDetailView(detailViewName);
                var item = detailView.getItemByName(itemName);
                item.label = "TestLabel";
                document.location.reload(true);
            },
            MobileCRM.bridge.alert, null
        );
    },

    OpenForm: function () {
        data.innerHTML = "";
        var entity = new MobileCRM.FetchXml.Entity("account");
        //entity.addAttributes();
        var linkEntity = entity.addLink("contact", "parentcustomerid", "accountid",
            "inner");
        linkEntity.addAttribute("contactid");
        linkEntity.addAttribute("fullname");
        entity.filter = new MobileCRM.FetchXml.Filter();
        entity.filter.where("accountid", "eq", accountId);
        var fetch = new MobileCRM.FetchXml.Fetch(entity);
        fetch.execute(
            "Array",
            function (res) {
                if (res && res.length > 0) {
                    for (var i in res) {
                        var contact = res[i];
                        try {
                            var a = document.createElement("a");
                            a.href = "#";
                            a.id = contact[0];
                            a.addEventListener("click",
                                function (e) {
                                    MobileCRM.UI.FormManager.showEditDialog("contact", e.target.id);
                                    reloadData();
                                },
                                false);
                            a.appendChild(document.createTextNode(contact[1]));
                            data.appendChild(a);
                            data.appendChild(document.createElement("br"));
                        }
                        catch (err) {
                            alert("Exception Error : \n\n" + err);
                        }
                    }
                }
            }, function (err) { alert(err); });
    },

    addAssociatedContact: function () {
        // Create reference for associated account
        try {
            var target = new MobileCRM.Reference("account", accountId);
            var relationShip = new MobileCRM.Relationship("parentcustomerid", target,
                null, null);
            MobileCRM.UI.FormManager.showNewDialog("contact", relationShip);
            // Show all associated contact at the begining;
            reloadData();
        } catch (err) {
            alert("Exception : " + err);
        }
    },

    reloadPage: function () {
        document.location.reload(true);
    },

    reloadData: function () {
        OpenForm();
    },

    error_callback: function (err) {
        MobileCRM.bridge.alert(" An Error Has occurred \n" + err);
    }

}

