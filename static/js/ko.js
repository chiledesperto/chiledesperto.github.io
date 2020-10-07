function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans.reverse();
}


// var al = firebase.database().ref()
var db = firebase.firestore();


// firebase.database().ref().on('value',(snap)=>{
let victim_model = new VictimsModel()
ko.applyBindings(victim_model)
// });


function Item(data) {
    this.culprit = ko.computed(function () {
        return data.attackers ? data.attackers.join(", ") : null

    });
    this.name = ko.observable(data.name);
    this.age = ko.observable(data.age);
    this.age_cat = ko.observable(data.age_cat);
    this.date = ko.observable(data.date);
    this.gob = ko.observable(data.gob);
    this.labels = ko.observable(data.labels);
    this.location = ko.observable(data.location);
    this.background = ko.computed(function () {
        return data.background == null ? null : data.background.split("\n")
    })
    this.death = ko.computed(function () {
        return data.death.split("\n")
    })
    this.aftermath = ko.computed(function () {
        return data.aftermath == null ? null : data.aftermath.split("\n")
    })
    this.attackers = ko.observable(data.attackers);
    this.sentence = ko.observable(data.sentence);
    this.status = ko.observable(data.status);
    this.read_more = ko.observable(data.status);
    this.picture = ko.observable(data.picture);
}


function YearItem(year, data) {
    var self = this
    self.year = ko.observable(year);
    self.items = ko.observable(data);
    self.auto_filters = ['age_cat', 'gob', 'location', 'sentence']
    self.list_filters = ['labels', 'attackers']
    self.folter = function (type, value_list) {
        return ko.utils.arrayFilter(self.items(), function (item) {
            console.log(item.name(), item.age_cat(), value_list.includes(item[type]()))
            return value_list.includes(item[type]())
        });
    }
}

function VictimsModel(data) {
    var self = this;
    self.aa = "djcen"
    self.mapuche_items = ko.observableArray([]);
    self.get_items = function () {
        let shit = []
        for (var i of range(2002, 2020)) {
            let fuck = i
            
            db.collection(i.toString()).where("labels", "array-contains", "mapuche")
                .get()
                .then(function (querySnapshot) {
                    let a = []
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                        let data = new Item(doc.data())
                        a.push(data)

                    });
                    if (a.length > 0) {
                        self.mapuche_items.push(new YearItem(fuck, a))
                        
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });

        }
        // data.map(y => self.mapuche_items.push(new YearItem(y, data.val()[y].map(x => new Item(x)))))
    }
    self.get_items()
    self.folter = function (type, value_list) {
        return ko.utils.arrayFilter(self.mapuche_items(), function (year) {
            return year().items().folter(type, value_list)
        })
    }
}
