import React from 'react';
import './suggested.css';

const VAMIcon = ({ className, svgClassName, name }) => (
  <div
    className={className}
    dangerouslySetInnerHTML={{
      __html: `<svg class="${svgClassName}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${name}"></use>
        </svg>`,
    }}
  />
);

const VamIcons = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    class="s-svg-icon"
  >
    <symbol id="googleplus" viewBox="0 0 100 100">
      <title>googleplus</title>
      <path
        d="M98.922 45.885H88.82V35.79h-8.082v10.094H70.634v8.075h10.103v10.094h8.082V53.96h10.103v-8.075zm-64.66-2.02v12.598h17.62c-1.354 7.591-7.94 13.123-17.62 13.123-10.668 0-19.337-9.024-19.337-19.684 0-10.66 8.669-19.663 19.337-19.663 4.81 0 9.113 1.655 12.508 4.885v.02l9.113-9.104c-5.597-5.209-12.891-8.419-21.62-8.419-17.863 0-32.33 14.455-32.33 32.301 0 17.847 14.467 32.302 32.33 32.302 18.67 0 31.036-13.123 31.036-31.575a36.81 36.81 0 0 0-.626-6.783h-30.41z"
        fillRule="nonzero"
        fill="currentColor"
      />
    </symbol>
    <symbol id="facebook" viewBox="0 0 100 100">
      <title>Facebook</title>
      <path
        d="M57.685 97V54.122h14.392l2.155-16.71H57.685V26.743c0-4.838 1.344-8.135 8.281-8.135l8.849-.004V3.66C73.285 3.455 68.032 3 61.921 3c-12.758 0-21.492 7.787-21.492 22.088v12.324H26v16.71h14.429V97h17.256z"
        fillRule="nonzero"
        fill="currentColor"
      />
    </symbol>
    <symbol id="pinterest" viewBox="0 0 100 100">
      <title>Pinterest</title>
      <path
        d="M15 37.001c0-3.98.695-7.736 2.075-11.247 1.38-3.512 3.286-6.591 5.727-9.21 2.441-2.62 5.239-4.883 8.403-6.798a38.668 38.668 0 0 1 10.234-4.31A43.832 43.832 0 0 1 52.61 4c5.821 0 11.248 1.23 16.261 3.68 5.014 2.45 9.089 6.019 12.225 10.704 3.135 4.684 4.703 9.97 4.703 15.866 0 3.54-.347 7.004-1.051 10.394a42.044 42.044 0 0 1-3.314 9.783c-1.512 3.126-3.352 5.887-5.53 8.262-2.179 2.375-4.845 4.272-8.018 5.699-3.174 1.417-6.657 2.131-10.45 2.131-2.507 0-4.995-.591-7.464-1.765-2.47-1.183-4.244-2.798-5.305-4.863a796.267 796.267 0 0 0-1.549 6.224c-.666 2.714-1.098 4.46-1.295 5.249-.207.788-.583 2.103-1.136 3.924-.554 1.822-1.033 3.136-1.437 3.925-.404.788-.995 1.943-1.765 3.455a38.406 38.406 0 0 1-2.544 4.28 166.793 166.793 0 0 1-3.427 4.78l-.77.272-.498-.554c-.554-5.783-.826-9.257-.826-10.393 0-3.39.394-7.201 1.192-11.417.79-4.225 2.019-9.52 3.68-15.895 1.663-6.375 2.62-10.121 2.874-11.229-1.183-2.394-1.765-5.511-1.765-9.342 0-3.06.957-5.933 2.873-8.628 1.915-2.694 4.347-4.037 7.295-4.037 2.253 0 4 .751 5.248 2.244 1.258 1.493 1.878 3.38 1.878 5.67 0 2.432-.808 5.953-2.432 10.563-1.624 4.61-2.432 8.055-2.432 10.337 0 2.319.827 4.253 2.488 5.774 1.662 1.53 3.671 2.29 6.028 2.29 2.028 0 3.906-.46 5.643-1.38a12.664 12.664 0 0 0 4.337-3.755 31.508 31.508 0 0 0 3.098-5.257 30.281 30.281 0 0 0 2.103-6.113c.498-2.159.864-4.206 1.108-6.14a43.9 43.9 0 0 0 .357-5.502c0-6.374-2.018-11.341-6.056-14.9-4.037-3.558-9.294-5.332-15.782-5.332-7.37 0-13.53 2.385-18.468 7.163-4.938 4.77-7.407 10.826-7.407 18.168 0 1.624.234 3.192.694 4.703.46 1.512.958 2.714 1.493 3.596a170.78 170.78 0 0 1 1.493 2.516c.46.789.695 1.352.695 1.69 0 1.033-.272 2.376-.826 4.037-.554 1.662-1.24 2.488-2.047 2.488-.075 0-.385-.056-.939-.169-1.878-.553-3.549-1.586-5.004-3.098a16.09 16.09 0 0 1-3.37-5.23 34.213 34.213 0 0 1-1.794-5.97A25.383 25.383 0 0 1 15 37z"
        fillRule="nonzero"
        fill="currentColor"
      />
    </symbol>
    <symbol id="tumblr" viewBox="0 0 100 100">
      <title>tumblr</title>
      <path
        d="M81.596 93.723V78.792s-8.077 4.041-14.134 4.041c-10.097 0-12.116-4.041-12.116-14.146v-24.25h22.212V26.25H55.346V2H41.212C39.192 20.187 31.115 26.25 19 30.292v14.145h14.135V74.75c0 16.167 8.077 24.25 26.25 24.25 14.134 0 22.211-5.277 22.211-5.277z"
        fillRule="nonzero"
        fill="currentColor"
      />
    </symbol>
    <symbol id="twitter" viewBox="0 0 100 100">
      <title>Twitter</title>
      <path
        d="M32.363 87.435c34.863 0 53.928-28.9 53.928-53.963 0-.82-.017-1.638-.054-2.451a38.559 38.559 0 0 0 9.455-9.821 37.775 37.775 0 0 1-10.885 2.986 19.032 19.032 0 0 0 8.335-10.49 37.997 37.997 0 0 1-12.036 4.603 18.926 18.926 0 0 0-13.835-5.992c-10.466 0-18.954 8.494-18.954 18.963 0 1.489.166 2.936.491 4.325-15.752-.793-29.72-8.34-39.069-19.816a18.925 18.925 0 0 0-2.566 9.533c0 6.58 3.346 12.389 8.434 15.787-3.11-.096-6.03-.95-8.584-2.372-.003.08-.003.157-.003.242 0 9.185 6.534 16.854 15.206 18.592a18.966 18.966 0 0 1-8.56.325c2.413 7.536 9.41 13.02 17.706 13.173a38.007 38.007 0 0 1-23.54 8.118 38.47 38.47 0 0 1-4.522-.262 53.625 53.625 0 0 0 29.054 8.52"
        fillRule="nonzero"
        fill="currentColor"
      />
    </symbol>
    <symbol id="valogo-clipped" viewBox="0 0 500 287">
      <title>valogo-clipped</title>
      <path
        d="M497.821 282.236c1.087.18 2.183.695 2.183 2.527 0 .671-.407 1.282-.951 1.647H378.985c-.6-.373-.96-1.015-.96-1.79 0-1.017.538-2.17 1.872-2.365a59.277 59.277 0 0 1 3.703-.407c4.262-.358 9.802-1.094 12.711-2.477 3.688-1.755 5.874-5.495 5.874-8.76 0-2.579-1.124-5.935-2.283-9.324l-65.88-182.601S359.332 3.104 359.87 1.464c.627-1.916 2.42-1.967 3.138-.062.629 1.662 96.134 251.01 98.56 257.333 7.558 19.734 20.269 22.124 31.9 23.066 2.377.194 3.894.361 4.352.435zm-138.614-17.87c1.704.536 2.073 2.597 1.466 4.021-3.093 7.246-13.882 15.873-28.046 18.022h-14.773c-14.003-1.757-24.017-8.009-29.833-15.956-10.218 7.352-22.217 13.072-36.055 15.956h-39.964c-29.143-6.51-44.743-27.794-44.744-53.228 0-27.548 19.51-47.622 42.498-58.375 4.232-1.937 9.248-4.128 13.29-5.586 0 0-3.37-5.149-6.444-10.244-11.373-18.86-13.87-41.41-4.204-56.853 10.01-15.992 28.48-22.382 45.76-22.382 13.86 0 26.07 4.343 34.222 9.771 7.929 5.28 13.722 13.2 13.722 23.392 0 17.189-13.816 27.7-22.845 32.93-9.254 5.36-22.884 12.49-22.884 12.49s32.923 52.05 51.068 80.728c9.973-15.068 16.83-35.12 18.641-48.722.81-6.089 1.225-10.559-3.047-13.421-2.65-1.775-6.896-2.436-12.705-2.742-.889-.046-2.199-.18-2.932-.356-1.058-.257-1.79-.891-1.79-2.018 0-1.2.7-2.2 2.242-2.2l46.363.01c.941 0 1.827.552 1.992 1.808.108.834-.238 1.978-1.437 2.334-.863.255-1.884.368-4.186.6-5.305.534-8.977 1.673-12.338 5.62-2.425 2.849-4.043 9.712-5.141 14.253-3.184 13.17-10.124 33.117-22.297 50.157 4.784 7.559 7.965 12.587 8.274 13.07 5.609 8.805 13.157 17.456 20.657 17.456 4.01 0 8.18-1.247 10.114-5.852 1.667-3.97 3.082-5.394 5.356-4.682zM258.45 274.392c9.086 0 18.173-3.293 26.369-8.776-18.644-28.817-20.78-32.244-59.129-91.826l-.12-.186-.053-.083c-17.584 11.364-22.403 29.403-22.403 43.244 0 28.598 24.275 57.627 55.336 57.627zM238.688 92.36c-6.946 10.057-2.26 24.999 2.839 34.661 5.821 11.032 15.978 26.835 15.978 26.835 11.778-7.806 19.1-21.83 19.1-36.426 0-23.222-11.963-32.42-21.748-32.42-7.202 0-12.576 2.148-16.169 7.35zm-6.298-80c-3.49 2.069-5.536 6.202-6.807 9.321-1.433 3.517-97.996 247.63-104.79 264.728h-3.283c-5.469-16.533-83.259-252.095-85.2-257.95-2.008-6.056-6.035-13.649-11.916-16.481-2.9-1.396-5.432-2.067-13.274-2.625-3.531-.253-5.413-.5-6.042-.789C.43 8.267-.075 7.656.01 6.571.114 5.2 1.196 4.537 2.181 4.537l107.154-.007c1.66 0 2.54.318 2.843 1.842.29 1.464-.479 2.661-1.832 2.778-1.287.11-1.944.163-3.357.261-10.293.715-14.419 2.433-16.49 7.326-1.136 2.68-.253 7.566 1.948 14.502 2.2 6.937 52.931 167.589 53.703 170.008h.258s64.04-165.361 66.45-171.914c2.418-6.576 3.57-12.107 1.424-15.22-2.284-3.313-5.342-4.147-13.3-4.709-3.298-.233-6.256-.417-7.549-.59-1.709-.228-2.075-1.23-2.075-2.121 0-1.756 1.503-2.15 2.804-2.15l55.638.02c1 0 2.066.766 2.066 2.158 0 1.317-1.012 2.04-2.31 2.11-9.17.497-13.705 1.479-17.166 3.53z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </symbol>
  </svg>
);

export default ({ children }) => {
  return (
    <div className="page-outer js-page-outer theme-egg-yolk">
      <link
        href="https://www.vam.ac.uk/assets/application-eb724ecd1a3aefc09883f691749b17ce4e26a327579d46efe39b1931aee5d398.css"
        rel="stylesheet"
      />
      <VamIcons />
      <div className="nav">
        <div className="banner js-banner" />
      </div>
      <main className="main">
        <header className="main__banner">
          <div className="main__title">
            <h1 className="main__heading">
              Inside an ocean liner: the 'Aquitania'{' '}
            </h1>

            <div className="main__articlereference">
              <p className="main__articlereference__ref">
                Produced as part of{' '}
                <span className="main__articlereference__ref__exhibname">
                  Ocean Liners: Speed and Style
                </span>
              </p>
              <p className="main__articlereference__exhibdates">
                On now until Sunday, 17 June 2018
              </p>
              <a
                className="btn btn--themed btn--light"
                href="https://www.vam.ac.uk/exhibitions/ocean-liners-speed-style"
              >
                Find out more
              </a>
            </div>
          </div>
          <div className="logo--header">
            <div className="logo">
              <VAMIcon
                className="logo__container"
                svgClassName="logo__icon themed--color"
                name="valogo-clipped"
              />
            </div>
          </div>
        </header>
        <section className="main__content">
          <article className="article">
            <ul className="article__social">
              <li className="article__social-title">Share</li>
              <li className="article__social-link">
                <a
                  aria-label="Share on Facebook"
                  href="https://www.facebook.com/sharer/sharer.php?u=https://www.vam.ac.uk/articles/inside-an-ocean-liner-aquitania"
                >
                  <div className="social-icon social-icon--onwhite">
                    <VAMIcon
                      className="social-icon__container"
                      svgClassName="social-icon__icon themed--color"
                      name="facebook"
                    />
                  </div>
                </a>{' '}
              </li>
              <li className="article__social-link">
                <a
                  aria-label="Share on Twitter"
                  href="https://twitter.com/home?status=https://www.vam.ac.uk/articles/inside-an-ocean-liner-aquitania"
                >
                  <div className="social-icon social-icon--onwhite">
                    <VAMIcon
                      className="social-icon__container"
                      svgClassName="social-icon__icon themed--color"
                      name="twitter"
                    />
                  </div>
                </a>{' '}
              </li>
              <li className="article__social-link">
                <a
                  aria-label="Share on Pin trest"
                  href="https://pinterest.com/pin/create/button/?url=https://www.vam.ac.uk/articles/inside-an-ocean-liner-aquitania&amp;media=V&amp;amp;A&amp;description="
                >
                  <div className="social-icon social-icon--onwhite">
                    <VAMIcon
                      className="social-icon__container"
                      svgClassName="social-icon__icon themed--color"
                      name="pinterest"
                    />
                  </div>
                </a>{' '}
              </li>
              <li className="article__social-link">
                <a href="http://www.tumblr.com/share/link?url=https://www.vam.ac.uk/articles/inside-an-ocean-liner-aquitania">
                  <div className="social-icon social-icon--onwhite">
                    <VAMIcon
                      className="social-icon__container"
                      svgClassName="social-icon__icon themed--color"
                      name="tumblr"
                    />
                  </div>
                </a>{' '}
              </li>
              <li className="article__social-link">
                <a
                  aria-label="Share on Google Plus"
                  href="https://plus.google.com/share?url=https://www.vam.ac.uk/articles/inside-an-ocean-liner-aquitania"
                >
                  <div className="social-icon social-icon--onwhite">
                    <VAMIcon
                      className="social-icon__container"
                      svgClassName="social-icon__icon themed--color"
                      name="googleplus"
                    />
                  </div>
                </a>{' '}
              </li>
            </ul>
            <p className="article__leadparagraph">
              Known as 'The Ship Beautiful', Cunard Line's 'Aquitania' (1914 –
              1950) was considered one of the most elegant ocean liners of the
              time when it set sail in 1914. A promotional poster from our
              collection features a beautifully illustrated cross-section view
              of the ship's interior.
            </p>
            <div className="sir-trevor-text">
              <p>
                Ocean liners were strictly organised spaces which reflected
                social hierarchies. The
                <i> Aquitania</i> provided accommodation for 3,230 passengers,
                with 618 in first-class, 614 in second-class, and 1,998 in
                third-class, as well as a crew of 972. First-class passengers
                occupied the upper, most-spacious areas, while engineers
                laboured in the boiler room deep down in the hull.
              </p>
            </div>
            <div className="sir-trevor-text">
              <p>
                Take a fascinating tour of the <i>Aquitania's</i> interior –
                from promenade deck to boiler room – with our interactive. Click
                on the pins to reveal original photographs and stories about the
                ship's design.{' '}
              </p>
            </div>

            <figcaption className="sir-trevor-image__caption">
              Cunard Line – to all parts of the world, poster, Ulrich Gutersohn,
              about 1920, England. Museum no. E.1829-2004. © Victoria and Albert
              Museum, London
            </figcaption>
            {children}

            <figcaption className="sir-trevor-image__caption">
              Cunard Line – to all parts of the world, poster, Ulrich Gutersohn,
              about 1920, England. Museum no. E.1829-2004. © Victoria and Albert
              Museum, London
            </figcaption>

            <section className="b-promo">
              <article
                className="b-promo__item js-object-fit-container"
                style={{
                  backgroundImage:
                    "url('https://vanda-production-assets.s3.amazonaws.com/2018/02/05/13/51/52/210f11b2-dfa0-4b18-9825-04d23a4a29fb/960.jpg')",
                }}
              >
                <a
                  className="b-promo__anchor"
                  data-tracking="promobox-exhibition"
                  href="https://www.vam.ac.uk//exhibitions/ocean-liners-speed-style"
                >
                  <div className="b-promo__content">
                    <h1 className="b-promo__type">Exhibition</h1>

                    <p className="b-promo__title">
                      Ocean Liners: Speed and Style
                    </p>

                    <p className="b-promo__sponsor" />

                    <div className="u-btn u-btn--arrowed s-themed s-themed--background-color s-themed--background-color--hover s-themed--border-color s-themed--border-color--hover">
                      Find out more
                    </div>
                  </div>
                </a>
              </article>
            </section>
            <div>
              <br />
              <center>© Victoria and Albert Museum, London 2018</center>
              <br />
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};
