import jsVectorMap from 'jsvectormap'
import 'jsvectormap/dist/maps/world'

const map02 = () => {
  const mapSelectorTwo = document.querySelectorAll('#mapTwo')

  if (mapSelectorTwo.length) {
    const mapTwo = new jsVectorMap({
      selector: '#mapTwo',
      map: 'world',
      zoomButtons: true,

      regionStyle: {
        initial: {
          fontFamily: 'Satoshi',
          fill: '#A9BDFF',
        },
        hover: {
          fillOpacity: 1,
          fill: '#3056D3',
        },
      },

      onRegionTooltipShow: function (tooltip, code) {
        if (code === 'EG') {
          tooltip.selector.innerHTML = tooltip.text() + ' <b>(Hello Russia)</b>'
        }
      },
    })
  }
}

export default map02
