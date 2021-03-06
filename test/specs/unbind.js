/**
 * Import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var plugin = require('../../index')
var createInstance = require('./helper').createInstance


describe('directive unbind', function () {
  var vm

  before(function () {
    Vue.use(plugin)
  })


  describe('$destroy', function () {
    describe('explicit', function () {
      beforeEach(function (done) {
        vm = createInstance({
          template: '<input type="text" v-model="msg" v-validate="required">',
          data: { msg: '' }
        })

        Vue.nextTick(done)
      })

      it('should not be error', function (done) {
        vm.$destroy()
        Vue.nextTick(done)
      })
    })

    describe('implicit', function () {
      beforeEach(function (done) {
        vm = createInstance({
          template: '<h1>Implicit destroy</h1><component is="{{currentView}}"></component>',
          components: {
            component1: {
              template: '<input type="number" v-model="percent" v-validate="min: 0" number>' +
                '<span v-show="validation.percent.invalid">invalid</span>',
              data: function () { return { percent: -2 } }
            },
            component2: {
              template: '<p>compnent2</p>'
            }
          },
          data: { currentView: 'component1' }
        }, false)
        
        Vue.nextTick(done)
      })

      it('should be validated', function () {
        expect(vm.$children[0].validation.percent.min).to.be(true)
        expect(vm.$children[0].validation.percent.valid).to.be(false)
        expect(vm.$children[0].validation.percent.invalid).to.be(true)
      })

      describe('switch component2', function () {
        beforeEach(function (done) {
          vm.$set('currentView', 'component2')
          Vue.nextTick(done)
        })

        it('should not be exist', function () {
          expect(vm.$children[0]).not.to.have.key('validation')
        })

        describe('switch component1', function () {
          beforeEach(function (done) {
            vm.$set('currentView', 'component1')
            Vue.nextTick(done)
          })

          it('should be validated', function () {
            expect(vm.$children[0].validation.percent.min).to.be(true)
            expect(vm.$children[0].validation.percent.valid).to.be(false)
            expect(vm.$children[0].validation.percent.invalid).to.be(true)
          })
        })
      })
    })
  })

  
  describe('v-if directive', function () {
    beforeEach(function (done) {
      var template = '<div v-if="enabled">'
        + '<input type="text" v-model="foo" v-validate="required, maxLength: 6">'
        + '<input type="text" v-model="bar" v-validate="min: 0, max:5">'
        + '</div>'
      vm = createInstance({
        template: template,
        data: { foo: 'hello', bar: 1, enabled: true }
      })

      Vue.nextTick(done)
    })

    describe('enabled default value true', function () {
      describe('validation properties', function () {
        it('should be expected', function () {
          expect(vm.validation.foo.required).to.be(false)
          expect(vm.validation.foo.maxLength).to.be(false)
          expect(vm.validation.foo.valid).to.be(true)
          expect(vm.validation.foo.invalid).to.be(false)
          expect(vm.validation.foo.dirty).to.be(false)
          expect(vm.validation.bar.min).to.be(false)
          expect(vm.validation.bar.max).to.be(false)
          expect(vm.validation.bar.valid).to.be(true)
          expect(vm.validation.bar.invalid).to.be(false)
          expect(vm.validation.bar.dirty).to.be(false)
          expect(vm.valid).to.be(true)
          expect(vm.invalid).to.be(false)
          expect(vm.dirty).to.be(false)
        })
      })
    })

    describe('set enabled value false', function () {
      beforeEach(function (done) {
        vm.enabled = false
        Vue.nextTick(done)
      })

      describe('set enabled value true', function () {
        beforeEach(function (done) {
          vm.enabled = true
          Vue.nextTick(done)
        })

        describe('validation properties', function () {
          it('should be expected', function () {
            expect(vm.validation.foo.required).to.be(false)
            expect(vm.validation.foo.maxLength).to.be(false)
            expect(vm.validation.foo.valid).to.be(true)
            expect(vm.validation.foo.invalid).to.be(false)
            expect(vm.validation.foo.dirty).to.be(false)
            expect(vm.validation.bar.min).to.be(false)
            expect(vm.validation.bar.max).to.be(false)
            expect(vm.validation.bar.valid).to.be(true)
            expect(vm.validation.bar.invalid).to.be(false)
            expect(vm.validation.bar.dirty).to.be(false)
            expect(vm.valid).to.be(true)
            expect(vm.invalid).to.be(false)
            expect(vm.dirty).to.be(false)
          })
        })
      })
    })
  })


  describe('objectable v-model', function () {
    beforeEach(function (done) {
      var template = '<div v-if="enabled">'
        + '<input type="text" v-model="obj.foo" v-validate="required, minLength: 0, maxLength: 5">'
        + '</div>'
      vm = createInstance({
        template: template,
        data: { enabled: true, obj: { foo: '' } }
      })

      Vue.nextTick(function () {
        vm.$set('enabled', false)
        Vue.nextTick(function () {
          vm.$set('enabled', true)
          Vue.nextTick(done)
        })
      })
    })

    it('should be validated', function () {
      expect(vm.validation.obj.foo.required).to.be(true)
      expect(vm.validation.obj.foo.minLength).to.be(false)
      expect(vm.validation.obj.foo.maxLength).to.be(false)
      expect(vm.validation.obj.foo.valid).to.be(false)
      expect(vm.validation.obj.foo.invalid).to.be(true)
      expect(vm.validation.obj.foo.dirty).to.be(false)
      expect(vm.valid).to.be(false)
      expect(vm.invalid).to.be(true)
      expect(vm.dirty).to.be(false)
    })
  })
})
