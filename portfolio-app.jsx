// portfolio-app.jsx — David-Heckhoff-inspired creative-dev aesthetic

const { useState, useEffect, useRef, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#ff5c2b",
  "show3D": true,
  "shape": "blob",
  "darkMode": true
}/*EDITMODE-END*/;

/* ============================================================
   3D HERO OBJECT — distorted icosphere with shader-like noise
   ============================================================ */
function Hero3D({ accent, shape }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ accent, shape });
  stateRef.current.accent = accent;
  stateRef.current.shape = shape;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !window.THREE) return;
    const THREE = window.THREE;

    let W = mount.clientWidth, H = mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    cam.position.set(0, 0, 4.6);

    /* === Build geometries for each shape variant === */
    function buildBlobGeometry() {
      const geo = new THREE.IcosahedronGeometry(1.4, 48);
      const pos = geo.attributes.position;
      const orig = new Float32Array(pos.array);
      geo.userData.orig = orig;
      return geo;
    }
    function buildKnotGeometry() {
      return new THREE.TorusKnotGeometry(1.05, 0.32, 256, 32, 2, 3);
    }
    function buildTorusGeometry() {
      return new THREE.TorusGeometry(1.2, 0.42, 32, 200);
    }

    let geo = buildBlobGeometry();

    /* === Materials === */
    // Inner solid (dark, gives it body)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0e1116, transparent: true, opacity: 0.95,
    });
    let mesh = new THREE.Mesh(geo, innerMat);
    scene.add(mesh);

    // Wireframe overlay — shares the same geometry as mesh so no per-frame rebuild is needed.
    // MeshBasicMaterial+wireframe is much cheaper than recreating WireframeGeometry every tick.
    const wireMat = new THREE.MeshBasicMaterial({
      color: accent, transparent: true, opacity: 0.9, wireframe: true,
    });
    let wire = new THREE.Mesh(geo, wireMat);
    scene.add(wire);

    // Outer halo wireframe
    const haloGeo = new THREE.IcosahedronGeometry(1.85, 2);
    const haloMat = new THREE.LineBasicMaterial({
      color: 0xf5efe6, transparent: true, opacity: 0.12,
    });
    const halo = new THREE.LineSegments(new THREE.EdgesGeometry(haloGeo), haloMat);
    scene.add(halo);

    // Particles around it
    const PCOUNT = 600;
    const pPos = new Float32Array(PCOUNT * 3);
    for (let i = 0; i < PCOUNT; i++) {
      const r = 2.4 + Math.random() * 2.2;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
      pPos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
      pPos[i*3+2] = r * Math.cos(ph);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf5efe6, size: 0.018, transparent: true,
      opacity: 0.55, sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* === Simplex-ish noise for blob deformation === */
    function noise3(x, y, z) {
      return Math.sin(x * 1.3 + Math.cos(y * 1.7)) *
             Math.cos(y * 1.5 + Math.sin(z * 1.1)) *
             Math.sin(z * 1.2 + Math.cos(x * 1.6));
    }

    /* === Mouse === */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);

    /* === Resize === */
    const onResize = () => {
      W = mount.clientWidth; H = mount.clientHeight;
      renderer.setSize(W, H);
      cam.aspect = W / H;
      cam.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize); ro.observe(mount);

    /* === Swap geometry when shape changes === */
    let currentShape = shape;
    function ensureShape(target) {
      if (target === currentShape) return;
      currentShape = target;
      mesh.geometry.dispose(); // wire shares the same ref, no need to dispose separately
      let next;
      if (target === 'knot') next = buildKnotGeometry();
      else if (target === 'torus') next = buildTorusGeometry();
      else next = buildBlobGeometry();
      mesh.geometry = next;
      wire.geometry = next; // share same geometry — no WireframeGeometry wrapper needed
    }

    /* === Animation === */
    let fid, t = 0;
    function animate() {
      t += 0.008;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      ensureShape(stateRef.current.shape);

      // Deform blob via noise
      if (currentShape === 'blob') {
        const pos = mesh.geometry.attributes.position;
        const orig = mesh.geometry.userData.orig;
        for (let i = 0; i < pos.count; i++) {
          const ox = orig[i*3], oy = orig[i*3+1], oz = orig[i*3+2];
          const n = noise3(ox * 1.4 + t, oy * 1.4 + t * 0.8, oz * 1.4 + t * 0.6);
          const s = 1 + n * 0.18;
          pos.setXYZ(i, ox * s, oy * s, oz * s);
        }
        pos.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
        // wire shares the same geometry, so it automatically picks up the updated positions
      }

      mesh.rotation.y = t * 0.4 + mouse.x * 0.3;
      mesh.rotation.x = mouse.y * 0.2 + Math.sin(t * 0.3) * 0.1;
      wire.rotation.copy(mesh.rotation);

      halo.rotation.y = -t * 0.2;
      halo.rotation.x = t * 0.15;
      particles.rotation.y = t * 0.05;

      // Update accent live
      wireMat.color.set(stateRef.current.accent);

      renderer.render(scene, cam);
      fid = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(fid);
      window.removeEventListener('mousemove', onMove);
      ro.disconnect();
      renderer.dispose();
      mesh.geometry.dispose(); // wire.geometry is the same ref, already disposed
      haloGeo.dispose(); pGeo.dispose();
      innerMat.dispose(); wireMat.dispose(); haloMat.dispose(); pMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{position:'absolute',inset:0}}></div>;
}

/* ============================================================
   NAV
   ============================================================ */
function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    const onResize = () => { if (window.innerWidth > 820) setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const close = () => setMobileOpen(false);

  return (
    <>
      <nav className="nav">
        <a href="#top" className="nav-brand" data-cursor="hover">
          <span className="nav-brand-mark"></span>
          Fenil Patel
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Path</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-right">
          <a href="#contact" className="nav-cta" data-cursor="hover">
            Available for hire
          </a>
          <button className="nav-hamburger" aria-label="Open navigation"
                  aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu" onClick={close}>
          <div className="mobile-menu-inner" onClick={e => e.stopPropagation()}>
            <button className="mobile-menu-close" onClick={close} aria-label="Close navigation">✕</button>
            <a href="#work" onClick={close}>Work</a>
            <a href="#about" onClick={close}>About</a>
            <a href="#skills" onClick={close}>Skills</a>
            <a href="#experience" onClick={close}>Path</a>
            <a href="#contact" onClick={close}>Contact</a>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero({ tweaks }) {
  return (
    <section className="hero anchor" id="top">
      {tweaks.show3D && (
        <div className="hero-3d">
          <Hero3D accent={tweaks.accent} shape={tweaks.shape} />
        </div>
      )}

      <div className="container hero-content">
        <div className="hero-eyebrow">
          <span className="dot"></span>
          Ahmedabad, IN — Edge AI Engineer
        </div>

        <h1 className="hero-name">
          <span className="line"><span className="word w1">Fenil</span></span>
          <span className="line"><span className="word w2 italic">Patel.</span></span>
        </h1>

        <div className="hero-desc-row">
          <div className="hero-role">
            <b>Edge AI Engineer</b> shipping real-time computer vision on NPU-class silicon.
          </div>
          <div className="hero-bio">
            I build production-grade neural pipelines that run on-device — compressing
            models, fusing operator graphs, and squeezing inference out of embedded SoCs
            so intelligence runs where the data already lives.
          </div>
          <div className="hero-cta-stack">
            <a href="#work" className="btn btn-primary" data-cursor="hover">
              Selected work
              <span className="arrow">↗</span>
            </a>
            <a href="#contact" className="btn btn-ghost" data-cursor="hover">
              Get in touch
              <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="marquee">
        <div className="marquee-track">
          <span>
            Edge AI <span className="dot">●</span>
            Computer Vision <span className="dot">●</span>
            NPU Deployment <span className="dot">●</span>
            Real-time Inference <span className="dot">●</span>
            Model Compression <span className="dot">●</span>
            Surveillance Intelligence <span className="dot">●</span>
            Embedded Systems <span className="dot">●</span>
          </span>
          <span>
            Edge AI <span className="dot">●</span>
            Computer Vision <span className="dot">●</span>
            NPU Deployment <span className="dot">●</span>
            Real-time Inference <span className="dot">●</span>
            Model Compression <span className="dot">●</span>
            Surveillance Intelligence <span className="dot">●</span>
            Embedded Systems <span className="dot">●</span>
          </span>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */
function About() {
  return (
    <section className="section anchor" id="about">
      <div className="container">
        <div className="sec-label reveal">About</div>
        <h2 className="sec-title reveal">
          Operator at the edge of <em>intelligence</em>.
        </h2>

        <div className="about-grid">
          <div className="about-portrait reveal">
            <span className="about-portrait-tag">FP / 25</span>
            <span className="about-portrait-glyph">FP</span>
          </div>
          <div className="about-body reveal">
            <p>
              I'm fascinated by the gap between a research notebook and a camera bolted
              to a wall in the rain. <em>Closing that gap</em> means caring as much about
              the compiler, the silicon and the ISP pipeline as the model itself.
            </p>
            <p>
              At <em>NXON AI</em> I architected a production AI-powered CCTV event-detection
              engine — 15+ real-time security events across simultaneous live multi-camera
              feeds, deployed fully on-chip across Augentix, Kneron and DeepX NPU SoCs.
            </p>
            <p>
              Currently shipping computer-vision intelligence onto NPU-class edge devices
              without giving up accuracy. Deep work in quantization-aware training, layer
              fusion, operator mapping, and the unglamorous craft of memory-bandwidth
              budgeting.
            </p>

            <div className="about-stats">
              <div>
                <div className="about-stat-val">&lt;100<span className="unit">ms</span></div>
                <div className="about-stat-lbl">Per-frame latency</div>
              </div>
              <div>
                <div className="about-stat-val">15<span className="unit">+</span></div>
                <div className="about-stat-lbl">AI event types</div>
              </div>
              <div>
                <div className="about-stat-val">3<span className="unit">×</span></div>
                <div className="about-stat-lbl">NPU SoC families</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   WORK / PROJECTS
   ============================================================ */
function Work() {
  return (
    <section className="section anchor" id="work">
      <div className="container">
        <div className="sec-label reveal">Selected work — 2023 / 2026</div>
        <h2 className="sec-title reveal">
          Systems shipped <em>in the field</em>.
        </h2>
        <p className="sec-sub reveal">
          Real production deployments and research artefacts. Every metric is from a
          real run — not a benchmark cherry-picked at peak.
        </p>

        <div className="proj-list">
          {PROJECTS.map((p, i) => {
            const Tag = p.github ? 'a' : 'div';
            const linkProps = p.github ? {
              href: p.github,
              target: '_blank',
              rel: 'noopener noreferrer',
            } : {};
            return (
              <Tag key={p.id} {...linkProps} className="proj-item reveal">
                <div className="proj-head">
                  <div className="proj-num">{String(i + 1).padStart(2, '0')}/</div>
                  <h3 className="proj-name">{p.name}</h3>
                  <div className="proj-meta">
                    <b>{p.metrics[0].val}{p.metrics[0].unit}</b>
                    {p.metrics[0].lbl}
                  </div>
                  <div className="proj-arrow">↗</div>
                </div>
                <div className="proj-preview" data-name={p.sub}></div>
                <div className="proj-tags">
                  {p.tags.map((t, j) => (
                    <span key={t} className={`proj-tag ${j === 0 ? 'accent' : ''}`}>{t}</span>
                  ))}
                  {p.tech.slice(0, 4).map(t => (
                    <span key={t} className="proj-tag">{t}</span>
                  ))}
                  {p.github && (
                    <span className="proj-tag proj-tag-github">GitHub ↗</span>
                  )}
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SKILLS
   ============================================================ */
function Skills() {
  return (
    <section className="section anchor" id="skills">
      <div className="container">
        <div className="sec-label reveal">Toolkit</div>
        <h2 className="sec-title reveal">
          Stack, scanned. <em>Confidence indexed.</em>
        </h2>

        <div className="skills-wrap">
          {SKILLS.map((cat, i) => (
            <div key={cat.cat} className="reveal">
              <div className="skill-cat-head">
                <span className="skill-cat-num">/{String(i + 1).padStart(2, '0')}</span>
                <h3 className="skill-cat-title">{cat.cat}</h3>
              </div>
              <div className="skill-tags">
                {cat.items.map(s => (
                  <span key={s.n} className="skill-tag" data-cursor="hover">{s.n}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   EXPERIENCE
   ============================================================ */
function Experience() {
  return (
    <section className="section anchor" id="experience">
      <div className="container">
        <div className="sec-label reveal">The path so far</div>
        <h2 className="sec-title reveal">
          A linear path through <em>nonlinear systems</em>.
        </h2>

        <div className="tl">
          {TIMELINE.map((t, i) => (
            <div className="tl-row reveal" key={i}>
              <div className="tl-time">{t.time}</div>
              <div>
                <h3 className="tl-role">{t.role}</h3>
                <div className="tl-desc">
                  <p style={{margin:0}}>{t.items[0]}</p>
                  {t.items.length > 1 && (
                    <ul>
                      {t.items.slice(1, 3).map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  )}
                </div>
              </div>
              <div className="tl-org">{t.org}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT
   ============================================================ */
function Contact() {
  return (
    <section className="contact anchor" id="contact">
      <div className="container">
        <div className="sec-label reveal">Get in touch</div>
        <h2 className="contact-headline reveal">
          Let's build<br/>
          something <em>intelligent.</em>
        </h2>

        <div className="contact-grid">
          <div className="reveal">
            <a className="contact-email" href={`mailto:${PROFILE.email}`} data-cursor="hover">
              <span className="arrow">↗</span>
              {PROFILE.email}
            </a>
            <p style={{
              marginTop: 32, maxWidth: 480, fontSize: 17,
              lineHeight: 1.6, color: 'var(--cream-dim)'
            }}>
              Recruiting for Edge AI, computer-vision or embedded ML roles? Building
              something that needs to run on-device? Send me a note — I read everything
              and reply within 24h.
            </p>
          </div>

          <div className="contact-side reveal">
            <div className="contact-block">
              <div className="contact-block-lbl">Based in</div>
              <div className="contact-block-val">Ahmedabad, India</div>
              <div className="contact-block-lbl" style={{marginTop:6}}>UTC +5:30 · Open to remote</div>
            </div>

            <div className="contact-block">
              <div className="contact-block-lbl">Direct uplinks</div>
              <div className="contact-links">
                <a href={`https://${PROFILE.github}`} target="_blank" rel="noreferrer" data-cursor="hover">
                  GitHub<span className="arrow">↗</span>
                </a>
                <a href={`https://${PROFILE.linkedin}`} target="_blank" rel="noreferrer" data-cursor="hover">
                  LinkedIn<span className="arrow">↗</span>
                </a>
                <a href={`tel:${PROFILE.phone.replace(/\s/g,'')}`} data-cursor="hover">
                  Phone<span className="arrow">↗</span>
                </a>
                <a href="./Fenil_Patel_Resume.pdf" download="Fenil_Patel_Resume.pdf" data-cursor="hover">
                  Resume.pdf<span className="arrow">↓</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <div>© 2026 Fenil Patel — Edge AI / Creative Dev</div>
          <div>Built with React + Three.js · Crafted at the edge</div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   APP
   ============================================================ */
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty('--orange', tweaks.accent);
  }, [tweaks.accent]);

  // Scroll reveals — must run after React mounts
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

    // Two ticks to ensure all React children have mounted
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelectorAll('.reveal').forEach(el => io.observe(el));
      });
    });
    return () => { cancelAnimationFrame(id); io.disconnect(); };
  }, []);

  return (
    <div className="app">
      <Nav />
      <Hero tweaks={tweaks} />
      <About />
      <Work />
      <Skills />
      <Experience />
      <Contact />

      <TweaksPanel>
        <TweakSection label="Brand" />
        <TweakColor label="Accent" value={tweaks.accent}
          options={['#ff5c2b', '#ffb800', '#22d3ee', '#a855f7', '#34d399']}
          onChange={v => setTweak('accent', v)} />

        <TweakSection label="3D" />
        <TweakToggle label="Hero 3D scene" value={tweaks.show3D}
          onChange={v => setTweak('show3D', v)} />
        <TweakRadio label="Shape" value={tweaks.shape}
          options={['blob', 'knot', 'torus']}
          onChange={v => setTweak('shape', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
