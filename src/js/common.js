(function (window, document) {
  "use strict";

  const retrieveURL = function (filename) {
    let scripts = document.getElementsByTagName("script");
    if (scripts && scripts.length > 0) {
      for (let i in scripts) {
        if (
          scripts[i].src &&
          scripts[i].src.match(new RegExp(filename + "\\.js$"))
        ) {
          return scripts[i].src.replace(
            new RegExp("(.*)" + filename + "\\.js$"),
            "$1"
          );
        }
      }
    }
  };

  function load(url, element) {
    let req = new XMLHttpRequest();

    req.onload = function () {
      if (this.readyState == 4 && this.status == 200) {
        element.insertAdjacentHTML("afterbegin", req.responseText);
      }
    };

    req.open("GET", url, true);
    req.send(null);
  }

  if (
    location.hostname !== "localhost" &&
    location.hostname !== "127.0.0.1" &&
    location.host !== ""
  ) {
    var files = [
        "https://wellwheel.com.ua/img/symbol_sprite.html",
        // "https://storehouse.ua/test/img/symbol_sprite.html",
      ],
      revision = 10;

    if (
      !document.createElementNS ||
      !document.createElementNS("http://www.w3.org/2000/svg", "svg")
        .createSVGRect
    )
      return true;

    var isLocalStorage =
        "localStorage" in window && window["localStorage"] !== null,
      request,
      data,
      insertIT = function () {
        document.body.insertAdjacentHTML("afterbegin", data);
      },
      insert = function () {
        if (document.body) insertIT();
        else document.addEventListener("DOMContentLoaded", insertIT);
      };
    files.forEach((file) => {
      try {
        let request = new XMLHttpRequest();
        request.open("GET", file, true);
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            data = request.responseText;
            insert();
            if (isLocalStorage) {
              localStorage.setItem("inlineSVGdata", data);
              localStorage.setItem("inlineSVGrev", revision);
            }
          }
        };
        request.send();
      } catch (e) {}
    });
  } else {
    load("/img/symbol_sprite.html", document.querySelector("body"));
  }
})(window, document);

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Input mask
   * https://github.com/text-mask/text-mask/tree/master/vanilla
   */
  var phoneMask = [
    "+",
    "3",
    "8",
    "(",
    /[0]/,
    /\d/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ];
  var myInputs = document.querySelectorAll('input[type="tel"]');
  if (myInputs) {
    for (var phones = 0; phones < myInputs.length; phones++) {
      var maskedInputController = vanillaTextMask.maskInput({
        inputElement: myInputs[phones],
        mask: phoneMask,
        // placeholderChar: '___(___) ___-__-__',
        guide: true,
        showMask: true,
        keepCharPositions: true,
      });
    }
  }

  let formAdditionalData = null;

  document.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const html = document.querySelector("html").getAttribute("lang");
    const result = form.querySelector("button[type='submit']");
    const tel = form.querySelector("input[type='tel']");
    // console.log(tel.value);

    if (tel) {
      tel.addEventListener("input", () => {
        tel.classList.remove("validation-error");
      });

      if (
        /^\+38\(0[0-9]{2}\)\s[0-9]{3}\-[0-9]{2}\-[0-9]{2}$/i.test(tel.value)
      ) {
        result.disabled = true;
        const btnText = result.innerHTML;
        if (html == "ru") {
          result.innerHTML = "Отправка";
        } else if (html == "uk") {
          result.innerHTML = "Відправка";
        }

        const formData = new FormData(form);

        const ref = window.document.referrer;
        const location = window.location;
        // const urlParams = new URLSearchParams(queryString);

        if (location) {
          formData.append("location", location);
        }

        if (ref) {
          formData.append("ref", ref);
        }

        if (formAdditionalData) {
          formAdditionalData.forEach((item) => {
            formData.append(item.name, item.value);
          });
        }

        fetch("https://wellwheel.com.ua/registration.php", {
          method: "POST",
          body: formData,
        }).then(() => {
          const tyblock = document.createElement("div");
          tyblock.classList.add("form-ty");

          if (html == "ru") {
            tyblock.innerHTML = "Спасибо за заявку!";
            result.innerHTML = "Отправлено!";
          } else if (html == "uk") {
            tyblock.innerHTML = "Дякуємо за заявку!";
            result.innerHTML = "Відправлено!";
          } else if (html == "en") {
            tyblock.innerHTML = "Thank you!";
            result.innerHTML = "Sent!";
          }

          form.appendChild(tyblock);
          setTimeout(function () {
            const modal = form.closest(".modal");
            if (modal) {
              $(`#${modal.id}`).modal("hide");
              tyblock.remove();
              form.reset();
              result.disabled = false;
              result.innerHTML = btnText;
            }
          }, 4000);
        });
      } else {
        tel.classList.add("validation-error");
      }
    } else {
      result.disabled = true;
      const btnText = result.innerHTML;
      if (html == "ru") {
        result.innerHTML = "Отправка";
      } else if (html == "uk") {
        result.innerHTML = "Відправка";
      }

      const formData = new FormData(form);

      const ref = window.document.referrer;
      const location = window.location;
      // const urlParams = new URLSearchParams(queryString);

      if (location) {
        formData.append("location", location);
      }

      if (ref) {
        formData.append("ref", ref);
      }

      if (formAdditionalData) {
        formAdditionalData.forEach((item) => {
          formData.append(item.name, item.value);
        });
      }

      fetch("./registration.php", {
        method: "POST",
        body: formData,
      }).then(() => {
        const tyblock = document.createElement("div");
        tyblock.classList.add("form-ty");

        if (html == "ru") {
          tyblock.innerHTML = "Спасибо за заявку!";
          result.innerHTML = "Отправлено!";
        } else if (html == "uk") {
          tyblock.innerHTML = "Дякуємо за заявку!";
          result.innerHTML = "Відправлено!";
        }

        form.appendChild(tyblock);
        setTimeout(function () {
          const modal = form.closest(".modal");
          if (modal) {
            $(`#${modal.id}`).modal("hide");
            tyblock.remove();
            form.reset();
            result.disabled = false;
            result.innerHTML = btnText;
          }
        }, 4000);
      });
    }
  });

  let navbar = document.querySelector(".navbar-toggler");
  let overlay = document.querySelector(".collapse-overlay");
  navbar.addEventListener("click", function () {
    overlay.classList.toggle("show");
  });

  $(".single-item").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow:
      '<button type="button" class="slick-prev"><img src="https://wellwheel.com.ua/img/prev-arrow.svg" class="prevBtn btn-item"></button>',
    nextArrow:
      '<button type="button" class="slick-next"><img src="https://wellwheel.com.ua/img/next-arrow.svg" class="nextBtn btn-item"></button>',
    responsive: [
      {
        breakpoint: 570,
        settings: {
          dots: true,
          arrows: false,
        },
      },
    ],
  });

  let cars = document.querySelectorAll(".car-img");
  let carCards = document.querySelectorAll(".car-item");

  cars.forEach(carFunction);

  function carFunction(car) {
    car.addEventListener("click", () => {
      cars.forEach((car) => {
        if (car.classList.contains("active")) {
          car.classList.remove("active");
        }
      });

      car.classList.add("active");
      let currentCar = car.dataset.product;

      carCards.forEach((card) => {
        card.classList.remove("active");
      });

      carCards.forEach((card) => {
        if (card.dataset.product == currentCar) {
          console.log(card.dataset.product);
          console.log(currentCar);
          card.classList.add("active");
        }
      });
    });
  }

  jQuery(function ($) {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 185) {
        $(".header").addClass("fixed-on");
      } else if ($(this).scrollTop() < 185) {
        $(".header").removeClass("fixed-on");
      }
    });



    $('#closeIframeModal').click(() => {
      stopFrame()
    })
    $('.modal').click(() => {
      stopFrame()
    })
    $(".cars-batton").click( () => {
      playFrame()
    })

  });

  var dataIframe = $(".cars-batton").attr("data-iframe");
  console.log('dataIframe', dataIframe)
  const playFrame = e =>{
    setTimeout(() =>{
      $("#video")[0].src = `${dataIframe}?autoplay=1`;
    }, 0)
  }
  const stopFrame = e =>{
    setTimeout(() =>{
      $("#video")[0].src = `${dataIframe}?autoplay=0`;
    }, 0)
  }

  const radioElements = document.querySelectorAll("[data-type]");

  document.addEventListener("click", (e) => {
    const dataType = e.target.dataset.type;
    const parrentWithDataType = e.target.closest("[data-type]");

    if (dataType) {
      radioElements.forEach((item) => {
        if (item.dataset.type === dataType) {
          item.classList.remove("active");
        }
      });

      e.target.classList.add("active");
    } else if (parrentWithDataType) {
      radioElements.forEach((item) => {
        if (item.dataset.type === parrentWithDataType.dataset.type) {
          item.classList.remove("active");
        }
      });

      parrentWithDataType.classList.add("active");
    }
  });

  const modalButtons = document.querySelectorAll('[data-toggle="modal"]');

  modalButtons.forEach((item) => {
    item.addEventListener("click", () => {
      const parrentBlock = item.closest(".js-modal-data");
      if (parrentBlock) {
        const activeData = parrentBlock.querySelectorAll("[data-type].active");
        let modalData = [];
        activeData.forEach((activeElement) => {
          modalData.push({
            name: activeElement.dataset.type,
            value: activeElement.dataset.value,
          });
        });

        formAdditionalData = null;
        formAdditionalData = modalData;
      } else {
        formAdditionalData = null;
      }
    });
  });


});
