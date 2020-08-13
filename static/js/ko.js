firebase.database().ref().on('value',(snap)=>{
    let victim_model = new VictimsModel(snap)
    ko.applyBindings(victim_model)
});


function Item(data) {
    this.culprit = ko.computed(function() {
        return data.esp.attackers ? data.esp.attackers.join(", ") : null

    });
    this.name = ko.observable(data.name);
    this.age = ko.observable(data.age);
    this.age_cat = ko.observable(data.age_cat);
    this.date = ko.observable(data.date);
    this.gob = ko.observable(data.gob);
    this.labels = ko.observable(data.esp.labels);
    this.location = ko.observable(data.esp.location);
    this.background = ko.computed(function(){
        return data.esp.background == null ? null : data.esp.background.split("\n")
    })
    this.death = ko.computed(function(){
        return data.esp.death.split("\n")
    })
    this.aftermath = ko.computed(function(){
        return data.esp.aftermath == null ? null : data.esp.aftermath.split("\n")
    })
    this.attackers = ko.observable(data.esp.attackers);
    this.sentence = ko.observable(data.esp.sentence);
    this.status = ko.observable(data.esp.status);
    this.read_more = ko.observable(data.esp.status);
    this.picture = ko.observable(data.picture);
}


function YearItem(year, items) {
    this.year = ko.observable(year);
    this.items = ko.observable(items);
}

function VictimsModel(data) {
    var self = this;
    self.aa = "djcen"
    self.mapuche_items = ko.observableArray([]);
    self.get_items = function() {
        var years = Object.keys(data.val()).reverse()
        var items = years.map(y => self.mapuche_items.push(new YearItem(y, data.val()[y].map(x => new Item(x)))))
    }
    self.get_items()
}
