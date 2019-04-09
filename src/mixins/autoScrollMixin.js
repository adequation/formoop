export default {
  methods: {
    isScrolledIntoView(el) {
      const rect = el.getBoundingClientRect();
      const elemTop = rect.top;
      const elemBottom = rect.bottom;

      // Here, only completely visible elements return true
      //if you want partially visible elements : elemTop < window.innerHeight && elemBottom >= 0;
      return (elemTop >= 0) && (elemBottom <= window.innerHeight);
    },

    scrollToFocused(el, params = {behavior: 'smooth', block: "center", inline: "center"}) {

      if (!el) return;

      if (!this.isScrolledIntoView(el))
        el.scrollIntoView(params);
    },

    scrollTo(delay=0, params = {left: 0, top: document.body.scrollHeight, behavior: 'smooth'}){
      setTimeout(function () {
        window.scrollTo(params);
      }, delay);
    }
  }
}
