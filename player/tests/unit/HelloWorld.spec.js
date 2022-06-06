import { mount } from '@vue/test-utils'
import HelloWorld from '../../src/components/HelloWorld.vue'

//check that the welcome message is there
test('check if title message is there', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.find('#welcome-message').exists()).toBe(true)
})

test('click next button', () => {
    const wrapper = mount(HelloWorld)
    const buttonWrapper = wrapper.findComponent({ ref: 'next' })
    buttonWrapper.trigger('click')
})

test('click shuffle button', () => {
    const wrapper = mount(HelloWorld)
    const buttonWrapper = wrapper.findComponent({ ref: 'shuffle' })
    buttonWrapper.trigger('click')
})

test('click prev button', () => {
    const wrapper = mount(HelloWorld)
    const buttonWrapper = wrapper.findComponent({ ref: 'back' })
    buttonWrapper.trigger('click')
})

test('click pause button', () => {
    const wrapper = mount(HelloWorld)
    const buttonWrapper = wrapper.findComponent({ ref: 'pause' })
    buttonWrapper.trigger('click')
})

test('click play button', () => {
    const wrapper = mount(HelloWorld)
    const buttonWrapper = wrapper.findComponent({ ref: 'play' })
    buttonWrapper.trigger('click')
})



