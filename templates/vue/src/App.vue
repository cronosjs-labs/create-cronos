<script>
	export default {
		methods: {
			redirect() {
				window.open('https://cronosjs.dev/', '_blank');
			}
		}
	};
</script>

<template>
	<img @click="redirect()" src="../public/cronos.webp" class="cronoslogo" alt="Cronos Logo" />
	<div class="container" />
	<svg  width="200" height="200" class="reactLogo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 221">
        <path fill="#41B883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z"></path>
        <path fill="#41B883" d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z"></path>
        <path fill="#35495E" d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0H50.56Z"></path>
    </svg>
</template>

<style scoped lang="less">
  .container {
    background-color: rgb(38, 211, 159);
    border-radius: 50%;
    height: 200px;
    left: 200px;
    opacity: 0.5;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
	filter: blur(72px);
  }

  .svelteLogo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: updown 2s ease-in-out infinite;
    filter: drop-shadow(0 0 0.5rem #b84141);
  }

  .cronoslogo {
    position: absolute;
    width: 100px;
    height: 100px;
    top: 25px;
    right: 25px;
    cursor: pointer;
	filter: drop-shadow(0 0 0.75rem #e87304);

  }

  @keyframes updown {
    0%,
    100% {
      transform: translate(-50%, -50%);
    }
    50% {
      transform: translate(-50%, calc(-50% + 10px));
    }
  }
</style>