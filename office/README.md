# Accessing the Office

1. Copy paste the `Office` folder into your website
2. Add the following into every html page that should be able to load the Office

```html
<script>
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "s") {
      document.body.style.opacity = 0;
      setTimeout(() => {
        window.location.href = "office?return=" +
          encodeURIComponent(window.location.pathname);
      }, 200);
    }
  });
</script>

```
