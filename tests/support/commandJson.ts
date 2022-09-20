export const imagineCommandJson = {
    "name": "imagine",
    "default_member_permissions": undefined,
    "default_permission": undefined,
    "description": "Generate images from prompts",
    "dm_permission": undefined,
    "options": [
        {
            "required": true,
            "type": 3,
            "name": "prompt",
            "description": "The prompt to generate an image with"
        },
        {
            "required": false,
            "type": 4,
            "name": "width",
            "min_value": 128,
            "max_value": 1024,
            "description": "The width of the generated image",
            "choices": [
                {
                    "name": "128px",
                    "name_localizations": undefined,
                    "value": 128
                },
                {
                    "name": "256px",
                    "name_localizations": undefined,
                    "value": 256
                },
                {
                    "name": "512px",
                    "name_localizations": undefined,
                    "value": 512
                },
                {
                    "name": "768px",
                    "name_localizations": undefined,
                    "value": 768
                },
                {
                    "name": "1024px",
                    "name_localizations": undefined,
                    "value": 1024
                }
            ]
        },
        {
            "required": false,
            "type": 4,
            "name": "height",
            "min_value": 128,
            "max_value": 1024,
            "description": "The height of the generated image",
            "choices": [
                {
                    "name": "128px",
                    "name_localizations": undefined,
                    "value": 128
                },
                {
                    "name": "256px",
                    "name_localizations": undefined,
                    "value": 256
                },
                {
                    "name": "512px",
                    "name_localizations": undefined,
                    "value": 512
                },
                {
                    "name": "768px",
                    "name_localizations": undefined,
                    "value": 768
                },
                {
                    "name": "1024px",
                    "name_localizations": undefined,
                    "value": 1024
                }
            ]
        },
        {
            "required": false,
            "type": 11,
            "name": "image",
            "description": "Inital jpg or png image to generate variations of. Will be resized to the specified width and height"
        },
        {
            "required": false,
            "type": 11,
            "name": "mask",
            "description": "Black and white jpg or png image to use as mask for inpainting over init_image"
        },
        {
            "required": false,
            "type": 10,
            "name": "pstrength",
            "description": "Prompt strength when using init image. 1.0 corresponds to full destruction of information in image",
            "min_value": 0,
            "max_value": 1
        },
        {
            "required": false,
            "type": 4,
            "name": "numout",
            "description": "How many images to generate with this prompt",
            "min_value": 1,
            "max_value": 4
        },
        {
            "required": false,
            "type": 4,
            "name": "numsteps",
            "description": "Number of denoising steps. Default 50",
            "min_value": 1,
            "max_value": 500
        },
        {
            "required": false,
            "type": 10,
            "name": "guidescale",
            "description": "Scale for classifier-free guidance. Default 7.5",
            "min_value": 1,
            "max_value": 20
        },
        {
            "required": false,
            "type": 4,
            "name": "seed",
            "description": "Generation seed. Randomized if not provided",
            "min_value": 0,
            "max_value": 999999999
        }
    ]
}

export const pingCommandJson = {
    name: 'ping',
    description: 'Pings the bot',
    options: [],
    default_permission: undefined,
    default_member_permissions: undefined,
    dm_permission: undefined
  }