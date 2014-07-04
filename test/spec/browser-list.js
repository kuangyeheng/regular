var Regular = require_lib("index.js");
void function(){

  function destroy(component, container){
    component.destroy();
    expect(container.innerHTML).to.equal('');
  }

  describe("List", function(){
    var container = document.createElement('div');

    describe("basic", function(){
      it("the list based on range should work", function(){
        var list = "<div t-test={{num}} class='m-model'>{{#list 1..3 as num}}<div class='a-{{num}}'>{{num}}</div> {{/list}}</div>"
        var BaseComponent = Regular.extend({
          template: list
        })

        var component = new BaseComponent().inject(container);
        expect($("div",container).length).to.equal(4);
        expect($(".a-1",container)[0].innerHTML).to.equal("1");
        expect($(".a-2",container)[0].innerHTML).to.equal("2");
        expect($(".a-3",container)[0].innerHTML).to.equal("3");
        destroy(component, container);
      })

      it("should destroy clear when have non parentNode", function(){
        var list = "{{#list 1..3 as num}}{{num}}{{/list}}"
        var component = new Regular({
          template: list
        }).inject(container);
        expect(container.innerHTML.slice(-3)).to.equal("123")
        destroy(component, container);
      })

      it("the dom should sync with the 'sequence' value", function(){
        var list =
          "{{#list todos as todo}}" + 
            "<div class='a-{{todo_index}}'>{{todo.content}}</div>" + 
          "{{/list}}";
        var component = new Regular({
          data: {todos: [{content: "hello"}, {content: "hello2"}]},
          template: list
        }).inject(container);
        expect($("div",container).length).to.equal(2);
        expect($(".a-0",container)[0].innerHTML).to.equal("hello");
        expect($(".a-1",container)[0].innerHTML).to.equal("hello2");

        component.$update(function(data){
          data.todos.push({content: 'lily'})
          data.todos[0].content = 'people'
        })

        expect($(".a-0",container)[0].innerHTML).to.equal("people");
        expect($(".a-1",container)[0].innerHTML).to.equal("hello2");
        expect($(".a-2",container)[0].innerHTML).to.equal("lily");

        destroy(component, container);
      })

      it("list should work with sibling node or text", function(){
        var list =
          "<a>name</a>{{#list todos as todo}}" + 
            "<div >{{todo.content}}</div>" + 
          "{{/list}}xxx";
        var component = new Regular({
          data: {todos: [{content: "hello"}, {content: "hello2"}]},
          template: list
        }).inject(container);

        expect($('a', container).length).to.equal(1);
        expect($("div",container).length).to.equal(2);
        expect(container.innerHTML.slice(-3)).to.equal('xxx');
        destroy(component, container);

      })

      it("the VARIABLE_index should work as expected", function(){
        var list =
          "{{#list 1..4 as num}}" + 
            "<div class='a-{{num}}'>{{num_index}}</div>" + 
          "{{/list}}"
        var component = new Regular({
          data: {todos: [{content: "hello"}, {content: "hello2"}]},
          template: list
        }).inject(container);

        expect($("div",container).length).to.equal(4);
        expect($(".a-1",container)[0].innerHTML).to.equal("0");
        expect($(".a-2",container)[0].innerHTML).to.equal("1");
        expect($(".a-3",container)[0].innerHTML).to.equal("2");

        destroy(component, container);

      })

      it("the 'sequence' with expression should work as expect", function(){
        var list =
          "{{#list this.filter() as num}}" + 
            "<div>{{num_index}}</div>"+
          "{{/list}}"
        var List = Regular.extend({
          template: list, 
          data: { len: 1, todos:[1,2,3,4,5,6] },
          filter: function(){
            var data = this.data;
            return data.todos.slice(0, data.len);
          }
        });
        var component = new List().inject(container);

        expect($("div",container).length).to.equal(1);

        component.$update('len',5);
        expect($("div",container).length).to.equal(5);
        expect($("div",container)[4].innerHTML).to.equal("4");

        destroy(component, container);

      })
    })
    describe("list with nested", function(){

      it("list can work with component", function(){

      var TodoComponent = Regular.extend({
        name: 'todo',
        template: "<div>{{content}}</div>"
      });

      var component = new Regular({
        data: {todos: [{content: "hello"}, {content: "hello2"}]},
        template: 
          "{{#list todos as todo}}\
            <todo content={{todo.content}}/>\
           {{/list}}"
      }).inject(container);

      expect($("div",container).length).to.equal(2);
      expect($("div", container)[0].innerHTML).to.equal("hello");
      expect($("div", container)[1].innerHTML).to.equal("hello2");

      destroy(component, container)

      })

    })
  })

}()