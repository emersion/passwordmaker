self.port.on("passwd-auto-fill", function (passwd) {
  if (document.activeElement) {
  	document.activeElement.value = passwd;
  }
});
