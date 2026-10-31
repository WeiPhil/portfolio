// Profile & Project Assets
import philPicture from './images/phil_picture.jpg';
import resumePdf from './resume.pdf';
import primeLogo from './images/prime_logo.png';

// Directional Hash Encoding (2026)
import directionalHashThumb from './directional_hash_encoding/teaser.png';
import directionalHashTeaser from './directional_hash_encoding/teaser_large.png';

// Practical Reconstruction (2025)
import practicalReconThumb from './practical_reconstruction/teaser_small.png';
import practicalReconTeaser from './practical_reconstruction/teaser.png';
import laplacianPyramidImg from './practical_reconstruction/laplacian_pyramid.png';
import gradientFilteringImg from './practical_reconstruction/gradient_filtering_limitation.png';
import subsurfaceVsDipoleImg from './practical_reconstruction/subsurface_vs_dipole.png';
import dengComparisonImg from './practical_reconstruction/deng_comparison.png';
import faceOptimVideo from './practical_reconstruction/face_optim.mp4';
import lightAnimVideo from './practical_reconstruction/light_anim.mp4';
import lightAnimCloseVideo from './practical_reconstruction/light_anim_close.mp4';
import lightAnimEnvmapVideo from './practical_reconstruction/light_anim_envmap.mp4';
import cameraAnimVideo from './practical_reconstruction/camera_anim.mp4';

// Neural BVH (2024)
import neuralBvhThumb from './neural_bvh/teaser.png';
import neuralBvhTeaser from './neural_bvh/teaser_large.png';

// Neural LoD (2023)
import neuralLodThumb from './neural_lod/fractal_thumbnail.png';
import neuralLodTeaser from './neural_lod/neural_lod_teaser.png';

// EARS (2022)
import earsTeaser from './ears/ears_teaser.png';

// OPSR (2021)
import opsrThumb from './opsr/beach_thumbnail.png';

// Multilayered (2020)
import layeredAnisoImg from './layered/layered_aniso.png';
import layeredVaryingImg from './layered/layered_aniso_05_05_top_varying.png';
import layeredGrazingImg from './layered/grazing_angles_overblur.png';

// Personal & Study Projects
import qulkanImg from './images/qulkanScreenshot.png';
import procaryotaImg from './images/procaryotaScreenshot.png';
import lotrImg from './images/lotrScreenshot.png';
import cs440Img from './images/cs440.png';
import imageAndVideoImg from './images/imageAndVideoProc.gif';

export const profileData = {
  name: 'Philippe Weier',
  email: 'ph.weier@gmail.com',
  avatar: philPicture,
  cvUrl: resumePdf,
  primeLogo,
  socials: {
    scholar: 'https://scholar.google.com/citations?user=I15wjrQAAAAJ&hl=en',
    github: 'https://github.com/WeiPhil',
    linkedin: 'https://ch.linkedin.com/in/philippe-weier-5125a2165',
    twitter: 'https://twitter.com/PhilippeWeier',
  },
};

export const publicationsData = [
  {
    id: 'directional_hash_encoding',
    slug: '/directional_hash_encoding',
    title: 'Beyond Positional Encoding: A 5D Spatio-Directional Hash Encoding',
    year: 2026,
    venueLine: 'ACM SIGGRAPH 2026 (Conference Track)',
    venuePrefix: 'Published at',
    venueLinkText: 'SIGGRAPH 2026',
    venueUrl: 'https://s2026.siggraph.org/',
    venueSuffix: '(Conference Track)',
    thumbnail: directionalHashThumb,
    teaserImage: directionalHashTeaser,
    teaserPaddingTop: '36.29%',
    teaserFlat: true,
    teaserCaption: 'Spatio-Directional Hash Encoding Teaser',
    authors: [
      {
        name: 'Philippe Weier',
        isMe: true,
        affiliations: ['Meta, Switzerland', 'Saarland University, Germany'],
      },
      {
        name: 'Lukas Bode',
        affiliations: ['Meta, Switzerland'],
      },
      {
        name: 'Philipp Slusallek',
        url: 'https://graphics.cg.uni-saarland.de/people/slusallek.html',
        affiliations: ['Saarland University, Germany'],
      },
      {
        name: 'Adrián Jarabo',
        url: 'https://scholar.google.com/citations?user=pXKBhbkAAAAJ&hl=en',
        affiliations: ['Meta, Spain'],
      },
      {
        name: 'Sébastien Speierer',
        url: 'https://speierers.github.io/',
        affiliations: ['Meta, Switzerland'],
      },
    ],
    abstract: [
      'In this work, we propose a new spatio-directional neural encoding that is compact and efficient, and supports all-frequency signals in both space and direction. Current learnable encodings focus on Cartesian orthonormal spaces, which have been shown to be useful for representing high-frequency signals in the spatial domain. However, directly applying these encodings in the directional domain results in distortions, singularities, and discontinuities. As a result, most related works have used more traditional encodings for the directional domain, which lack the expressivity of learnable neural encodings. We address this by proposing a new angular encoding that generalizes the hash-grid approach from Müller et al. [2022] to the directional domain by encoding directions using a hierarchical geodesic grid. Each vertex in the geodesic grid stores a learnable latent parameter, which is used to feed a neural network. Armed with this directional encoding, we propose a five-dimensional encoding for spatio-directional signals. We demonstrate that both encodings significantly outperform other hash-based alternatives. We apply our five-dimensional encoding in the context of neural path guiding, outperforming the state of the art by up to a factor of 2 in terms of variance reduction for the same number of samples.',
    ],
    links: [
      {
        type: 'github',
        label: 'Code',
        url: 'https://github.com/facebookresearch/spatio_directional_hash_encoding',
      },
      {
        type: 'paper',
        label: 'Paper (49.2 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/directional_hash_encoding.pdf',
      },
      {
        type: 'supplemental',
        label: 'Supplemental (14.8 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/directional_hash_encoding_supplemental.pdf',
      },
      {
        type: 'acm',
        label: 'ACM Link',
        url: 'https://dl.acm.org/doi/10.1145/3799902.3811182',
      },
      {
        type: 'presentation',
        label: 'Presentation (66 MB)',
        url: `${import.meta.env.BASE_URL}directional_hash_encoding_presentation.zip`,
      },
    ],
    interactivePresentation: {
      title: 'Interactive Presentation',
      subtitle: 'Navigate with arrow keys or swipe. Click and drag on interactive 3D widgets.',
      iframeTitle: 'SIGGRAPH 2026 Presentation — Beyond Positional Encoding',
      url: `${import.meta.env.BASE_URL}directional_hash_encoding_presentation/index.html`,
    },
    videos: [
      {
        title: 'Supplemental Video',
        type: 'mp4',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/directional_hash_encoding_supplemental_video.mp4',
      },
    ],
    bibtex: `@inproceedings{Weier2026Beyond,
\t\tauthor = {Weier, Philippe and Bode, Lukas and Slusallek, Philipp and Jarabo, Adri\\'{a}n and Speierer, S\\'{e}bastien},
\t\ttitle = {Beyond Positional Encoding: A 5D Spatio-Directional Hash Encoding},
\t\tyear = {2026},
\t\tisbn = {9798400725548},
\t\tpublisher = {Association for Computing Machinery},
\t\taddress = {New York, NY, USA},
\t\turl = {https://doi.org/10.1145/3799902.3811182},
\t\tdoi = {10.1145/3799902.3811182},
\t\tbooktitle = {Proceedings of the Special Interest Group on Computer Graphics and Interactive Techniques Conference Conference Papers},
\t\tarticleno = {118},
\t\tnumpages = {10},
\t\tkeywords = {ray tracing, neural representations, directional encoding, path guiding, radiance field},
\t\tseries = {SIGGRAPH Conference Papers '26}
\t}`,
    customAcknowledgments:
      'The authors would like to thank Alexander Rath for his assistance and support with the implementation of his Neural Path Guiding framework. We also thank the various artists for the textures and scenes used in this paper, including Benedikt Bitterli, Wig42, Jay, and Piopis.',
  },
  {
    id: 'practical_reconstruction',
    slug: '/practical_reconstruction',
    title: 'Practical Inverse Rendering of Textured and Translucent Appearance',
    year: 2025,
    venueLine: 'ACM Transactions on Graphics (Proceedings of SIGGRAPH 2025)',
    venuePrefix: 'Published in ACM Transactions on Graphics (Proceedings of',
    venueLinkText: 'SIGGRAPH 2025',
    venueUrl: 'https://s2025.siggraph.org/',
    venueSuffix: ')',
    thumbnail: practicalReconThumb,
    teaserImage: practicalReconTeaser,
    teaserPaddingTop: '42.174940898%',
    teaserFlat: true,
    teaserCaption: 'Practical Reconstruction Teaser',
    rootPaddingMd: 10,
    authors: [
      {
        name: 'Philippe Weier',
        isMe: true,
        affiliations: ['Google', 'Saarland University'],
      },
      {
        name: 'Jérémy Riviere',
        url: 'https://scholar.google.com/citations?user=FaLQzRAAAAAJ&hl=en',
        affiliations: ['Google'],
      },
      {
        name: 'Ruslan Guseinov',
        url: 'https://ruslanguseinov.com/',
        affiliations: ['Google'],
      },
      {
        name: 'Stephan Garbin',
        url: 'http://stephangarbin.com/',
        affiliations: ['Google'],
      },
      {
        name: 'Philipp Slusallek',
        url: 'https://graphics.cg.uni-saarland.de/people/slusallek.html',
        affiliations: ['DFKI', 'Saarland University'],
      },
      {
        name: 'Bernd Bickel',
        url: 'https://berndbickel.com/',
        affiliations: ['Google'],
      },
      {
        name: 'Thabo Beeler',
        url: 'https://thabobeeler.com/',
        affiliations: ['Google'],
      },
      {
        name: 'Delio Vicini',
        url: 'https://dvicini.github.io/',
        affiliations: ['Google'],
      },
    ],
    abstract: [
      'Inverse rendering has emerged as a standard tool to reconstruct the parameters of appearance models from images (e.g., textured BSDFs). In this work, we present several novel contributions motivated by the practical challenges of recovering high-resolution surface appearance textures, including spatially-varying subsurface scattering parameters.',
      'First, we propose Laplacian mipmapping, which combines differentiable mipmapping and a Laplacian pyramid representation into an effective preconditioner. This seemingly simple technique significantly improves the quality of recovered surface textures on a set of challenging inverse rendering problems. Our method automatically adapts to the render and texture resolutions, only incurs moderate computational cost and achieves better quality than prior work while using fewer hyperparameters. Second, we introduce a specialized gradient computation algorithm for textured, path-traced subsurface scattering, which facilitates faithful reconstruction of translucent materials. By using path tracing, we enable the recovery of complex appearance while avoiding the approximations of the previously used diffusion dipole methods. Third, we demonstrate the application of both these techniques to reconstructing the textured appearance of human faces from sparse captures. Our method recovers high-quality relightable appearance parameters that are compatible with current production renderers.',
    ],
    links: [
      {
        type: 'github',
        label: 'Code',
        url: 'https://github.com/google/practical-inverse-rendering-of-textured-and-translucent-appearance',
      },
      {
        type: 'paper',
        label: 'Paper (40.6 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/practical_reconstruction.pdf',
      },
      {
        type: 'paper',
        label: 'Paper (low-res, 12.8 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/practical_reconstruction_low_res.pdf',
      },
      {
        type: 'supplemental',
        label: 'Supplemental (31.2 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/practical_reconstruction_supplemental.pdf',
      },
      {
        type: 'scrollVideo',
        label: 'Supplemental Video',
        targetId: 'supplemental-video',
      },
      {
        type: 'viewer',
        label: 'Interactive Viewer',
        url: `${import.meta.env.BASE_URL}practical_reconstruction_viewer/`,
      },
      {
        type: 'presentation',
        label: 'Presentation (with Speaker Notes) (472 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/practical_reconstruction_presentation.pptx',
      },
      {
        type: 'acm',
        label: 'ACM Link',
        url: 'https://dl.acm.org/doi/10.1145/3730855',
      },
    ],
    sections: [
      {
        title: 'Laplacian mipmapping',
        description:
          'We propose Laplacian mipmapping, a novel preconditioning technique that synergizes differentiable mipmapping with a Laplacian pyramid representation. This approach markedly improves the quality and robustness of recovered surface textures, particularly in complex inverse rendering scenarios. It offers the advantages of automatically adapting to different render and texture resolutions, incurring only moderate computational overhead, and proving less sensitive to hyperparameter adjustments compared to previous methods.',
        viewerCallout: {
          prefix: 'Be sure to also check out our ',
          linkText: 'supplemental viewer',
          url: `${import.meta.env.BASE_URL}practical_reconstruction_viewer/`,
          suffix: ' where you can interactively compare different scenes against previous work!',
        },
        cardFigures: [
          {
            image: laplacianPyramidImg,
            title: 'laplacian_pyramid',
            paddingTop: '72.7810650888%',
            caption: (
              <>
                We construct a texture&apos;s mipmap hierarchy from a Laplacian pyramid. A texture
                lookup during rendering thus accumulates information from all levels in the
                Laplacian pyramid below the queried mipmap level (red).
              </>
            ),
          },
          {
            image: gradientFilteringImg,
            title: 'gradient_filtering_limitation',
            paddingTop: '76.1811023622%',
            caption: (
              <>
                Comparison of our method to cross-bilateral gradient filtering [Chang et al. 2024]
                on a scene where a 4096<sup>2</sup> texture is simultaneously optimized for a
                close-up (top row) and a wide-angle view (bottom row), each rendered at 1024
                <sup>2</sup>. We find the optimal learning rate (lr) and cross-bilateral filter
                weight 𝜎 using a grid search. We do this for both views at the same time (&quot;Opt.
                combined&quot;), as well as for each view individually (&quot;Opt. close&quot; and
                &quot;Opt. far&quot;). The optimal parameters for one view do not generalize to the
                other, and even the best combined filter bandwidth 𝜎 cannot simultaneously handle
                both views.
              </>
            ),
          },
        ],
      },
      {
        title: 'Differentiable subsurface scattering',
        description:
          'Our work introduces a specialized gradient computation algorithm designed for efficient, textured, path-traced subsurface scattering. This enables the faithful and accurate reconstruction of translucent materials. By employing path tracing, our method overcomes the approximations inherent in prior diffusion dipole techniques, allowing for the recovery of intricate appearance details that were previously challenging to capture.',
        cardFigures: [
          {
            image: subsurfaceVsDipoleImg,
            title: 'subsurface_vs_dipole',
            paddingTop: '37.5247524752%',
            caption: (
              <>
                <b>Left:</b> Path-traced subsurface scattering estimates outgoing radiance by
                sampling a light path through the object&apos;s interior. The medium parameters are
                set by evaluating 2D textures at the point of entry. <b>Right:</b> An alternative,
                approximate solution are diffusion dipole models [Jensen et al. 2001], which
                directly sample outgoing surface locations according to a two-dimensional scattering
                profile [King et al. 2013].
              </>
            ),
          },
          {
            image: dengComparisonImg,
            title: 'deng_comparison',
            paddingTop: '81.1023622047%',
            caption: (
              <>
                Comparison of our method and the differentiable diffusion dipole model [Deng et al.
                2022].
              </>
            ),
          },
        ],
      },
      {
        title: 'Facial appearance reconstruction',
        description:
          'We apply the aforementioned techniques to the task of reconstructing human facial appearance from sparse multi-view captures, where each capture uses a different point light to illuminate the subject. This combined approach allows for the recovery of high-quality, relightable appearance parameters for skin that are compatible with standard production renderers. The method utilizes differentiable path tracing to optimize the parameters of established rendering models for human skin.',
        videoCards: [
          {
            video: faceOptimVideo,
            caption:
              'Subsurface scattering parameter optimization is performed in two steps. First, we optimize the parameters of a principled BSDF. The base color of the principled BSDF is then converted to single scattering albedo, which is further optimized along with the textured extinction and phase function parameters.',
          },
          {
            video: lightAnimVideo,
            caption:
              'Once the subsurface scattering parameters are optimized we can easily relight the model under a moving point light.',
          },
          {
            video: lightAnimCloseVideo,
            caption:
              'Our Laplacian mipmapping allows high-frequency detail, such as glints, to be recovered — a previously challenging task in facial appearance recovery.',
          },
          {
            video: lightAnimEnvmapVideo,
            caption:
              'Although the dataset contains only point light sources, the model can be relit under different environment maps, since the optimized textures are independent of the lighting used during re-rendering.',
          },
          {
            video: cameraAnimVideo,
            caption:
              'Similarly, we can re-render from novel camera views, even though our initial dataset is sparse.',
          },
        ],
      },
    ],
    videos: [
      {
        id: 'supplemental-video',
        title: 'Supplemental video',
        type: 'mp4',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/practical_reconstruction_supplemental_video.mp4',
      },
    ],
    bibtex: `@article{Weier2025PracticalInverse,
  title   = {Practical Inverse Rendering of Textured and Translucent Appearance},
  author  = {Philippe Weier and J\\'{e}r\\'{e}my Riviere and Ruslan Guseinov and Stephan Garbin and Philipp Slusallek and Bernd Bickel and Thabo Beeler and Delio Vicini},
  year    = 2025,
  month   = aug,
  journal = {Transactions on Graphics (Proceedings of SIGGRAPH)},
  volume  = 44,
  number  = 4,
  doi     = {10.1145/3730855}
}`,
    primeAcknowledgment: true,
  },
  {
    id: 'neural_bvh',
    slug: '/neural_bvh',
    title: 'N-BVH: Neural ray queries with bounding volume hierarchies',
    year: 2024,
    venueLine: 'ACM SIGGRAPH 2024 (Conference Track)',
    venuePrefix: 'Published at',
    venueLinkText: 'SIGGRAPH 2024',
    venueUrl: 'https://s2024.siggraph.org/',
    venueSuffix: '(Conference Track)',
    thumbnail: neuralBvhThumb,
    teaserImage: neuralBvhTeaser,
    teaserPaddingTop: '42.579750346%',
    teaserFlat: true,
    teaserCaption: 'Neural BVH Teaser',
    authors: [
      {
        name: 'Philippe Weier',
        isMe: true,
        affiliations: ['DFKI', 'Saarland University'],
      },
      {
        name: 'Alexander Rath',
        url: 'https://graphics.cg.uni-saarland.de/people/rath.html',
        affiliations: ['DFKI', 'Saarland University'],
      },
      {
        name: 'Élie Michel',
        url: 'https://portfolio.exppad.com/',
        affiliations: ['Adobe'],
      },
      {
        name: 'Iliyan Georgiev',
        url: 'https://www.iliyan.com/',
        affiliations: ['Adobe'],
      },
      {
        name: 'Philipp Slusallek',
        url: 'https://graphics.cg.uni-saarland.de/people/slusallek.html',
        affiliations: ['DFKI', 'Saarland University'],
      },
      {
        name: 'Tamy Boubekeur',
        url: 'https://perso.telecom-paristech.fr/boubek/',
        affiliations: ['Adobe'],
      },
    ],
    abstract: [
      "Neural representations have shown spectacular ability to compress complex signals in a fraction of the raw data size. In 3D computer graphics, the bulk of a scene's memory usage is due to polygons and textures, making them ideal candidates for neural compression. Here, the main challenge lies in finding good trade-offs between efficient compression and cheap inference while minimizing training time. In the context of rendering, we adopt a ray-centric approach to this problem and devise N-BVH, a neural compression architecture designed to answer arbitrary ray queries in 3D. Our compact model is learned from the input geometry and substituted for it whenever a ray intersection is queried by a path-tracing engine. While prior neural compression methods have focused on point queries, ours proposes neural ray queries that integrate seamlessly into standard ray-tracing pipelines. At the core of our method, we employ an adaptive BVH-driven probing scheme to optimize the parameters of a multi-resolution hash grid, focusing its neural capacity on the sparse 3D occupancy swept by the original surfaces. As a result, our N-BVH can serve accurate ray queries from a representation that is more than an order of magnitude more compact, providing faithful approximations of visibility, depth, and appearance attributes. The flexibility of our method allows us to combine and overlap neural and non-neural entities within the same 3D scene and extends to appearance level of detail.",
    ],
    links: [
      {
        type: 'github',
        label: 'Code',
        url: 'https://github.com/WeiPhil/nbvh',
      },
      {
        type: 'paper',
        label: 'Paper (13.2 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/neural_bvh.pdf',
      },
      {
        type: 'supplemental',
        label: 'Supplemental (7.1 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/neural_bvh_supplemental.pdf',
      },
      {
        type: 'viewer',
        label: 'Interactive Viewer',
        url: `${import.meta.env.BASE_URL}neural_bvh_viewer/`,
      },
      {
        type: 'presentation',
        label: 'Presentation (with Speaker Notes)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/nbvh_presentation.pptx',
      },
      {
        type: 'acm',
        label: 'ACM Link',
        url: 'https://dl.acm.org/doi/10.1145/3641519.3657464',
      },
    ],
    videos: [
      {
        title: 'Fast Forward Video',
        type: 'mp4',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/nbvh_fast_forward.mp4',
      },
      {
        title: 'Supplemental Video',
        type: 'mp4',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/neural_bvh_supplemental_video.mp4',
      },
    ],
    bibtex: `@inproceedings{Weier2024NeuralBVH,
\t\tauthor = {Weier, Philippe and Rath, Alexander and Michel, \\'{E}lie and Georgiev, Iliyan and Slusallek, Philipp and Boubekeur, Tamy},
\t\ttitle = {N-BVH: Neural ray queries with bounding volume hierarchies},
\t\tbooktitle = {ACM SIGGRAPH 2024 Conference Papers},
\t\tyear = {2024},
\t\tisbn = {9798400705250},
\t\turl = {https://doi.org/10.1145/3641519.3657464},
\t\tdoi = {10.1145/3641519.3657464},
\t}`,
    primeAcknowledgment: true,
  },
  {
    id: 'neural_lod',
    slug: '/neural_lod',
    title: 'Neural Prefiltering for Correlation-Aware Levels of Detail',
    year: 2023,
    venueLine: 'ACM Transactions on Graphics (Proceedings of SIGGRAPH 2023)',
    venuePrefix: 'Published in ACM Transactions on Graphics (Proceedings of',
    venueLinkText: 'SIGGRAPH 2023',
    venueUrl: 'https://s2023.siggraph.org/',
    venueSuffix: ')',
    thumbnail: neuralLodThumb,
    teaserImage: neuralLodTeaser,
    teaserPaddingTop: '44.41%',
    teaserFlat: true,
    teaserCaption: 'Neural Lod Teaser',
    authors: [
      {
        name: 'Philippe Weier',
        isMe: true,
        affiliations: ['DFKI', 'Saarland University'],
      },
      {
        name: 'Tobias Zirr',
        url: 'https://alphanew.net/',
        affiliations: ['Intel Corporation'],
      },
      {
        name: 'Anton Kaplanyan',
        url: 'http://kaplanyan.com/',
        affiliations: ['Intel Corporation'],
      },
      {
        name: 'Ling-Qi Yan',
        url: 'https://sites.cs.ucsb.edu/~lingqi/',
        affiliations: ['University of California'],
      },
      {
        name: 'Philipp Slusallek',
        url: 'https://graphics.cg.uni-saarland.de/people/slusallek.html',
        affiliations: ['DFKI'],
      },
    ],
    abstract: [
      'We introduce a practical general-purpose neural appearance filtering pipeline for physically-based rendering. We tackle the previously difficult challenge of aggregating visibility across many levels of detail from local information only, without relying on learning visibility for the entire scene. The high adaptivity of neural representations allows us to retain geometric correlations along rays and thus avoid light leaks. Common approaches to prefiltering decompose the appearance of a scene into volumetric representations with physically-motivated parameters, where the inflexibility of the fitted models limits rendering accuracy. We avoid assumptions on particular types of geometry or materials, bypassing any special-case decompositions. Instead, we directly learn a compressed representation of the intra-voxel light transport. For such high-dimensional functions, neural networks have proven to be useful representations. To satisfy the opposing constraints of prefiltered appearance and correlation-preserving point-to-point visibility, we use two small independent networks on a sparse multi-level voxel grid. Each network requires 10-20 minutes of training to learn the appearance of an asset across levels of detail. Our method achieves 70-95% compression ratios and around 25% of quality improvements over previous work. We reach interactive to real-time framerates, depending on the level of detail.',
    ],
    links: [
      {
        type: 'github',
        label: 'Code',
        url: 'https://github.com/WeiPhil/neural_lod',
      },
      {
        type: 'paper',
        label: 'Paper (18.3 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/neural_lod.pdf',
      },
      {
        type: 'supplemental',
        label: 'Supplemental (5.3 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/neural_lod_supplemental.pdf',
      },
      {
        type: 'viewer',
        label: 'Interactive Viewer',
        url: `${import.meta.env.BASE_URL}neural_lod_viewer/`,
      },
      {
        type: 'presentation',
        label: 'Presentation (with Speaker Notes)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/neural_lod_presentation.pptx',
      },
      {
        type: 'acm',
        label: 'ACM Link',
        url: 'https://dl.acm.org/doi/10.1145/3592443',
      },
    ],
    videos: [
      {
        title: 'Fast Forward Video',
        type: 'mp4',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/neural_lod_fast_forward.mp4',
      },
      {
        title: 'Supplemental Video',
        type: 'mp4',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/neural_lod_supplemental_video.mp4',
      },
    ],
    bibtex: `@article{Weier2024NeuralLod,
  title = {Neural Prefiltering for Correlation-Aware Levels of Detail},
  author = {Weier, Philippe and Zirr, Tobias and Kaplanyan, Anton and Yan, Ling-Qi and Slusallek, Philipp},
  year = {2023},
  month = aug,
  journal = {ACM Trans. Graph.},
  volume = {42},
  number = {4},
  issn = {0730-0301},
  doi = {10.1145/3592443},
}`,
    primeAcknowledgment: true,
  },
  {
    id: 'ears',
    slug: '/ears',
    title: 'EARS: Efficiency-Aware Russian Roulette and Splitting',
    year: 2022,
    venueLine: 'ACM Transactions on Graphics (Proceedings of SIGGRAPH 2022)',
    venuePrefix: 'Published in ACM Transactions on Graphics (Proceedings of',
    venueLinkText: 'SIGGRAPH 2022',
    venueUrl: 'https://s2022.siggraph.org/',
    venueSuffix: ')',
    thumbnail: earsTeaser,
    teaserImage: earsTeaser,
    teaserPaddingTop: '56.32%',
    teaserFlat: false,
    teaserCaption: 'EARS Teaser',
    rootPaddingMd: 150,
    authors: [
      {
        name: 'Alexander Rath',
        url: 'https://graphics.cg.uni-saarland.de/people/rath.html',
        affiliations: ['DFKI', 'Saarland University'],
      },
      {
        name: 'Pascal Grittmann',
        url: 'https://graphics.cg.uni-saarland.de/people/grittmann.html',
        affiliations: ['DFKI', 'Saarland University'],
      },
      {
        name: 'Sebastian Herholz',
        url: 'https://www.intel.com/content/www/us/en/developer/articles/community/rendering-researchers-sebastian-herholz.html',
        affiliations: ['Intel Corporation'],
      },
      {
        name: 'Philippe Weier',
        isMe: true,
        affiliations: ['DFKI', 'Saarland University'],
      },
      {
        name: 'Philipp Slusallek',
        url: 'https://graphics.cg.uni-saarland.de/people/slusallek.html',
        affiliations: ['DFKI', 'Saarland University'],
      },
    ],
    abstract: [
      'Russian roulette and splitting are widely used techniques to increase the efficiency of Monte Carlo estimators. But, despite their popularity, there is little work on how to best apply them. Most existing approaches rely on simple heuristics based on, e.g., surface albedo and roughness. Their efficiency often hinges on user-controlled parameters. We instead iteratively learn optimal Russian roulette and splitting factors during rendering, using a simple and lightweight data structure. Given perfect estimates of variance and cost, our fixed-point iteration provably converges to the optimal Russian roulette and splitting factors that maximize the rendering efficiency. In our application to unidirectional path tracing, we achieve consistent and significant speed-ups over the state of the art.',
    ],
    links: [
      {
        type: 'github',
        label: 'Code',
        url: 'https://github.com/iRath96/ears',
      },
      {
        type: 'paper',
        label: 'Paper (30.7 MB)',
        url: 'https://graphics.cg.uni-saarland.de/papers/rath-2022-ears.pdf',
      },
      {
        type: 'viewer',
        label: 'Interactive Viewer',
        url: 'https://graphics.cg.uni-saarland.de/papers/ears/',
      },
      {
        type: 'presentation',
        label: 'Presentation',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/opsr_egsr_presentation.pptx',
      },
    ],
    videos: [
      {
        title: null,
        type: 'youtube',
        embedUrl: 'https://www.youtube-nocookie.com/embed/Fby_DTcbU0c',
      },
    ],
    bibtex: `@article{Rath2022Ears,
  author          = {Rath, Alexander and Grittmann, Pascal and Herholz, Sebastian and Weier, Philippe and Slusallek, Philipp},
  title           = {EARS: Efficiency-Aware Russian Roulette and Splitting},
  journal         = {ACM Transactions on Graphics (Proceedings of SIGGRAPH 2022)},
  numpages        = {14},
  volume          = {41},
  number          = {4},
  articleno       = {81},
  year            = {2022},
  month           = {jul},
  doi             = {10.1145/3528223.3530168},
  publisher       = {ACM}
}`,
    primeAcknowledgment: true,
  },
  {
    id: 'opsr',
    slug: '/opsr',
    title: 'Optimised Path Space Regularisation',
    year: 2021,
    venueLine: 'Published in Computer Graphics Forum (Proceedings of Eurographics Symposium on Rendering)',
    venuePrefix: 'Published in Computer Graphics Forum (Proceedings of',
    venueLinkText: 'Eurographics Symposium on Rendering',
    venueUrl: 'https://egsr.eu/',
    venueSuffix: ')',
    thumbnail: opsrThumb,
    teaserImage: opsrThumb,
    teaserPaddingTop: '56.32%',
    teaserFlat: false,
    teaserCaption: 'OPSR Teaser',
    rootPaddingSm: 150,
    authors: [
      {
        name: 'Philippe Weier',
        isMe: true,
        affiliations: ['Weta Digital'],
      },
      {
        name: 'Marc Droske',
        url: 'https://marc.droske.org/',
        affiliations: ['Weta Digital'],
      },
      {
        name: 'Johannes Hanika',
        url: 'https://jo.dreggn.org/home/',
        affiliations: ['Weta Digital', 'Karlsruhe Institute of Technology'],
      },
      {
        name: 'Andrea Weidlich',
        url: 'https://research.nvidia.com/person/andrea-weidlich',
        affiliations: ['Weta Digital'],
      },
      {
        name: 'Jiří Vorba',
        url: 'https://cgg.mff.cuni.cz/~jirka/',
        affiliations: ['Weta Digital', 'Charles University'],
      },
    ],
    abstract: [
      'We present Optimised Path Space Regularisation (OPSR), a novel regularisation technique for forward path tracing algorithms. Our regularisation controls the amount of roughness added to materials depending on the type of sampled paths and trades a small error in the estimator for a drastic reduction of variance in difficult paths, including indirectly visible caustics. We formulate the problem as a joint bias-variance minimisation problem and use differentiable rendering to optimise our model. The learnt parameters generalise to a large variety of scenes irrespective of their geometric complexity. The regularisation added to the underlying light transport algorithm naturally allows us to handle the problem of near-specular and glossy path chains robustly. Our method consistently improves the convergence of path tracing estimators, including state-of-the-art path guiding techniques where it enables finding otherwise hard-to-sample paths and thus, in turn, can significantly speed up the learning of guiding distributions.',
    ],
    links: [
      {
        type: 'github',
        label: 'Source Code',
        url: 'https://github.com/WeiPhil/OptimisedPathSpaceRegularisation',
      },
      {
        type: 'paper',
        label: 'Paper (58.8 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/OPSR_EGSR2021.pdf',
      },
      {
        type: 'archive',
        label: 'Supplemental (153.8 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/opsr_supplemental.zip',
      },
      {
        type: 'presentation',
        label: 'Presentation (40.8 MB)',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/opsr_egsr_presentation.pptx',
      },
    ],
    videos: [
      {
        title: null,
        type: 'mp4',
        url: 'https://weiphil.s3.eu-central-1.amazonaws.com/opsr_presentation_final.mp4',
        footnote: {
          prefix: 'The original EGSR talk can also be found ',
          linkText: 'here',
          url: 'https://www.youtube.com/watch?v=u9HqKGqvJhQ&t=2074s',
          suffix: '',
        },
      },
    ],
    bibtex: `@article{Weier2021Opsr,
  author = {Weier, Philippe and Droske, Marc and Hanika, Johannes and Weidlich, Andrea and Vorba, Jiří},
  title = {Optimised Path Space Regularisation},
  year = 2021,
  journal = {Computer Graphics Forum (Proceedings of Eurographics Symposium on Rendering)},
  year = 2021,
  volume = 40,
  number = 4,
  doi = {10.1111/cgf.14347}
}`,
  },
  {
    id: 'multilayered',
    slug: '/multilayered',
    title: 'Rendering Layered Materials with Anisotropic Interfaces',
    year: 2020,
    venueLine: 'Published in Journal of Computer Graphics Techniques (JCGT)',
    venuePrefix: 'Published in Journal of Computer Graphics Techniques (',
    venueLinkText: 'JCGT',
    venueUrl: 'http://jcgt.org/',
    venueSuffix: ')',
    thumbnail: layeredAnisoImg,
    teaserImage: layeredAnisoImg,
    teaserFixedDimensions: true,
    teaserCaption: 'Layered Teaser',
    rootPaddingSm: 150,
    authors: [
      {
        name: 'Philippe Weier',
        isMe: true,
        affiliations: ['EPFL', 'Unity Technologies'],
      },
      {
        name: 'Laurent Belcour',
        url: 'https://belcour.github.io/blog/',
        affiliations: ['Unity Technologies'],
      },
    ],
    abstract: [
      'We present a lightweight and efficient method to render layered materials with anisotropic interfaces. Our work extends the statistical framework of Belcour [2018] to handle anisotropic microfacet models. A key insight to our work is that when projected on the tangent plane, BRDF lobes from an anisotropic GGX distribution are well approximated by ellipsoidal distributions aligned with the tangent frame: its covariance matrix is diagonal in this space. We leverage this property and perform the adding-doubling algorithm on each anisotropy axis independently. We further update the mapping of roughness to directional variance and the evaluation of the average reflectance to account for anisotropy. We extensively tested this model against ground truth.',
    ],
    abstractLink: {
      match: 'Belcour [2018]',
      url: 'https://belcour.github.io/blog/research/2018/05/05/brdf-realtime-layered.html',
    },
    links: [
      {
        type: 'paper',
        label: 'Paper (10.8 MB)',
        url: 'http://jcgt.org/published/0009/02/03/paper.pdf',
      },
      {
        type: 'archive',
        label: 'Code (20.8 KB)',
        url: 'http://jcgt.org/published/0009/02/03/mitsuba_supplemental.zip',
      },
      {
        type: 'archive',
        label: 'Supplemental (4.1 GB)',
        url: 'http://jcgt.org/published/0009/02/03/html_supplemental.zip',
      },
    ],
    sections: [
      {
        title: 'Validation',
        titleVariant: 'h6',
        description:
          'We validated that our model was visualy close to the ground truth. See our supplemental material for all our results (warning: the archive is > 4GB).',
        stackedFigures: [
          {
            image: layeredVaryingImg,
            title: 'layered_aniso_05_05_top_varying',
            size: 600,
            borderless: true,
            caption:
              'Example of the validation of our layered model with respect to the ground truth when changing the roughness of the top dielectric layer.',
          },
          {
            image: layeredGrazingImg,
            title: 'grazing_angles_overblur',
            size: 450,
            borderless: false,
            caption:
              'Our method differs from the reference at grazing angles. This is due to the correlation between total internal reflection (TIR) and our precomputed average reflectance for one bounce. Since we do not account for it, our model overblurs the reflectance at grazing angles.',
          },
        ],
      },
    ],
    bibtex: `@article{Weier2020Layered,
  author =       {Philippe Weier and Laurent Belcour}, 
  title =        {Rendering Layered Materials with Anisotropic Interfaces},
  year =         2020,
  month =        {June},
  day =          20,
  journal =      {Journal of Computer Graphics Techniques (JCGT)},
  volume =       9,
  number =       2,
  pages =        {37--57},
  url =          {http://jcgt.org/published/0009/02/03/},
  issn =         {2331-7418}
}  `,
  },
];

export const personalProjectsData = [
  {
    id: 'qulkan',
    title: 'Qulkan',
    subtitle: 'A GPU Oriented Prototyping tool in C++17, 2019',
    thumbnail: qulkanImg,
    description:
      'Qulkan is a personal project designed to give a quick start to anyone considering using OpenGL or Vulkan as a graphical API. It has been designed to offer a simple and flexible interface for more complex software or research validation tools.',
    githubLink: 'https://github.com/WeiPhil/qulkan',
  },
  {
    id: 'procaryota',
    title: 'Procaryota',
    subtitle: 'A 2D space-shooter like game in C#, 2018',
    thumbnail: procaryotaImg,
    description:
      'Procaryota is beeing developped in my free time for fun. You incarnate a little cell fighting evil viruses, continuously evolving and trying to make his way through a dangerous environment.',
    githubLink: 'https://github.com/WeiPhil/Procaryota',
  },
  {
    id: 'lotr',
    title: 'Lotr Army Companion App',
    subtitle: 'Lord of the Ring: An unofficial companion App for your armies, 2018',
    thumbnail: lotrImg,
    descriptionRich: {
      prefix:
        'The Lotr Army Companion App is a full-stack Web Application created in React. It has been created for the table-top game ',
      linkText: 'Middle-Earth Strategy Battle Game',
      linkUrl: 'https://www.games-workshop.com/en-EU/Middle-earth',
      suffix:
        ' and its unofficial extension Battle Companies. It has a full database of all the Middle-Earth characters and an interactive army creation interface allowing you to quickly build up any army you would like to play.',
    },
    githubLink: 'https://github.com/WeiPhil/LotrArmyCompanion',
  },
];

export const studyProjectsData = [
  {
    id: 'cs440',
    title: 'Advanced Computer Graphics',
    subtitleRich: {
      prefix: 'Implementation and extension of a ray tracer in C++ using the ',
      linkText: 'Nori framework',
      linkUrl: 'https://wjakob.github.io/nori/',
      suffix: ', 2018',
    },
    thumbnail: cs440Img,
    descriptionRich: {
      prefix: 'During the course given by ',
      linkText: 'Wenzel Jakob',
      linkUrl: 'https://rgl.epfl.ch/people/wjakob/',
      suffix:
        ' at EPFL I extended my ray tracer with various features including a volumetric path tracer and won the 2nd place in the yearly rendering competition.',
    },
    projectPageLink: 'https://weiphil.github.io/acg2018/',
  },
  {
    id: 'computational_photography',
    title: 'Computational Photography',
    subtitle:
      'GPU implementation of different light field reconstruction algorithms using OpenGL3, 2019',
    thumbnail: imageAndVideoImg,
    descriptionMultiLinks: {
      part1:
        'During the Image and Video processing course (EE550) at EPFL, I implemented different reconstruction algorithms of the plenoptic function. It is mainly based on previous work on Light Field Rendering by ',
      link1Text: 'Marc Levoy',
      link1Url: 'https://graphics.stanford.edu/~levoy/',
      part2: ' and ',
      link2Text: 'Ren Ng',
      link2Url: 'https://graphics.stanford.edu/~renng/',
      part3:
        '. This includes a view-based reconstruction, digital refocusing and dynamic aperture change.',
    },
    githubLink: 'https://github.com/WeiPhil/LightFieldImaging',
  },
];

export function getPublicationById(id) {
  return publicationsData.find((pub) => pub.id === id);
}
