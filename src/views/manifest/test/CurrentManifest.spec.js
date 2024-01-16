// CurrentManifest.test.js

import { shallowMount, beforeEach } from '@vue/test-utils'
import CurrentManifest from '@/views/manifest/CurrentManifest.vue'
import { useOrderStore } from '@/stores/order'
import { describe, it, expect } from 'vitest'
import { jest } from 'jest'

jest.mock('@/stores/order')

describe('CurrentManifest', () => {
  let wrapper
  let mocks

  beforeEach(() => {
    mocks = {
      orderStore: {
        getCurrentManifest: jest.fn(),
        shipperPickedOrder: jest.fn(() => true)
      }
    }

    useOrderStore.mockReturnValue(mocks.orderStore)

    wrapper = shallowMount(CurrentManifest)
  })

  it('calls openProcessDialog when item clicked', async () => {
    const mockItem = {
      /* test data */
    }

    wrapper.vm.openProcessDialog(mockItem, 1)

    expect(wrapper.vm.isOpenDialogProcess).toBe(true)
    expect(wrapper.vm.dialogData).toBe(mockItem)
  })

  it('calls order store to add parcel when scanned', async () => {
    const mockBarcode = '1234'

    wrapper.vm.barcodeScanned = mockBarcode

    await wrapper.vm.addParcelProcess()

    expect(mocks.orderStore.shipperPickedOrder).toHaveBeenCalledWith({
      trackingId: mockBarcode
    })
  })

  it('submits process after unlocking slide', async () => {
    wrapper.vm.vueslideunlock = {
      reset: jest.fn()
    }
    wrapper.vm.popupInfo = {
      image: new Blob()
    }

    await wrapper.vm.submitProcess()

    expect(mocks.orderStore.shipperPickedOrder).toHaveBeenCalled()
    expect(wrapper.vm.vueslideunlock.reset).toHaveBeenCalled()
  })
})
