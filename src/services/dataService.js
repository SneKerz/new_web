export default class DataService {
  _data = {
    projectRepo: 'https://www.pump.fun/board',
    react95Repo: 'https://dexscreener.com/',
    items: [
      {
        id: 'about',
        name: 'About.txt',
        icon: 'info_bubble',
        content: {
          paragraphs: [
           
"Pepe Paint is a token deployed on Solana which will launch on pump.fun."
,
"The idea of the project is to test the viability of decentralizing AI generations for users."
,
"Using a Stable Diffusion model with a few added layers trained on images of Pepe and Ms. Paint drawings, we hope to achieve decentralized AI generation and crowdfunding for AI image generation."
,
"AI image generation is resource-intensive and quite expensive; the tech can't be run on-chain either."
,
"The current solution requires a payment of 100,000 tokens to generate images, each payment gives 5 outputs, which can be minted into NFTs to different addresses or inpainted to the collaborative Ms. Paint."
,
"The collaborative Ms. Paint is public and fully accessible to all holders, a 24h timer runs from 00:00 GMT+0 each day, when the timer runs out the painting is minted and airdropped randomly to one of those that participated."
,
"Holding a collaborative NFT gives users unlimited access to all AI generation features.",
          ],
        },
      },
      {
        id: 'projects',
        name: 'Workflow.txt',
        icon: 'flying_through_space_100',
        content: {
          projects: [
            {
              title: 'blue_pencil-XL',
              description:
                'The base mode is blue_pencil-XL ',
              url: 'https://huggingface.co/bluepen5805/blue_pencil-XL',
            },
            {
              title: 'SDXL MS Paint Portraits',
              description:
                'The first LORA is SDXL MS Paint Portraits',
              url: 'https://civitai.com/models/183354?modelVersionId=205793',

            },
            {
              title: 'pepe_frog',
              description:
                "Secondary LORA is pepe_frog SDXL",
              url: 'https://civitai.com/models/19006/pepefrog',
            },
            {
              title: 'Prompt',
              description:
                '<lora:SDXL_MSPaint_Portrait:1> MSPaint drawing of <lora:pepe_frog SDXL:0.7> pepe_frog wearing [outfit] holding [objesct], [emotion], full body'
            },
            {
              title: 'Negative prompt',
              description:
                'lowres, extra fingers, missing fingers, poorly rendered hands, mutation, deformed iris, deformed pupils, asymmetric, watermark',
            },
          
          ],
        },
      },

      {
        id: 'contact',
        name: 'Contact.txt',
        icon: 'inetcfg_2301',
        content: {
          emailText:
            'If you want to take part in the project, just email me on ',
          email: 'contact@pepepaint.com',
          socialText: 'Or you can reach me out through social media:',
          social: [
            {
              name: 'FaTwitter',
              link: 'https://twitter.com/PepePaintSol',
            },
          ],
        },
      },
      {
        id: 'contactTest',
        name: 'Results.txt',
        icon: 'progman_24',
        content: {
          imageUrls: [
            "https://i.imgur.com/KmBha3l.png",
"https://i.imgur.com/55PBeJw.png",
"https://i.imgur.com/G0OE9x0.png",
"https://i.imgur.com/zLRQg7t.png",
"https://i.imgur.com/VklrZIY.png",
"https://i.imgur.com/Ava5XCc.png",
"https://i.imgur.com/Zt5Hqk1.png",
"https://i.imgur.com/cmW2qt5.png",
"https://i.imgur.com/QRonWbI.png",
"https://i.imgur.com/OkQAEl7.png",
          ]
        }
      },
      {
        id: 'whitepaper',
        name: 'Whitepaper.txt',
        icon: 'shell32_2',
        content: {
          imageUrls: [
            "https://i.imgur.com/UsS20kp.png",
            "https://i.imgur.com/KXblsvY.png",
            "https://i.imgur.com/aCoiWiH.png",
            "https://i.imgur.com/U2FQieG.png",
            "https://i.imgur.com/0gzvvXD.png",            
          ]
        }
      }
      
    ],
  };

  getItems() {
    return this._data.items.map(({ id, name, icon }) => ({ id, name, icon }));
  }

  getItem(id) {
    return this._data.items.find((x) => x.id === id);
  }

  getProjectInfo() {
    return {
      projectRepo: this._data.projectRepo,
      react95Repo: this._data.react95Repo,
    };
  }
}
