# :space_invader: Artur Parkhisenko, personal website

- `npm run gulp` - build
- `npm run gulp serve`

## before build

- inspect manifest in devtools
- [test perf by lighthouse](https://github.com/GoogleChrome/lighthouse)

## after build

- [speed](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Farturparkhisenko.github.io%2F&tab=mobile)
- [doiuse](http://www.doiuse.com/)
- [tests](https://youtu.be/Use459WBeWc?t=1311)

### 2do:

in manifest.json:

```
"splash_screens": [
  {
    "src": "splash/lowres",
    "sizes": "320x240"
  }, {
    "src": "splash/hd_small",
    "sizes": "1334x750"
  }, {
    "src": "splash/hd_hi",
    "sizes": "1920x1080",
    "density": 3
  }
]
```
