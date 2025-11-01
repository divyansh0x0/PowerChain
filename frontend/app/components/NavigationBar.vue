<script setup lang="ts">
import { Icon } from "@iconify/vue";

interface NavLink {
    name: string,
    url: string,
    icon: string
}

const links: NavLink[] = [
    {
        name: "Home",
        url : "",
        icon: "mdi:home-variant-outline"
    },
    {
        name: "Map",
        url : "",
        icon: "mdi:map"
    },
    {
        name: "Complaints",
        url : "",
        icon: "streamline-freehand:customer-action-complaint"
    }
];
</script>

<template>
    <div class="nav-bg-overlay"></div>
    <nav class="navbar">
        <!--        <div>-->
        <ul class="nav-links">
            <li v-for="link in links" :key="link.name">
                <a :href="link.url" class="nav-link">
                    <Icon class="nav-link-icon" :icon="link.icon"/>
                    <span class="nav-link-name">{{ link.name }}</span>
                </a>
            </li>
            <li>
                <ButtonTheme />

            </li>
        </ul>

        <!--        </div>-->
    </nav>
</template>

<style scoped lang="scss">
.nav-bg-overlay {
    z-index: 98;
    position: fixed;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.45);
    display: none;
}

.navbar {
    user-select: none;
    background: none;
    z-index: 99;
    top: 0;
    left: 0;
    position: fixed;
    display: flex;
    justify-content: space-between;
    height: fit-content;
    width: 100%;
    padding: 0;

}


.nav-links {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;

    li {
        list-style: none;
    }
}

.nav-link {
    text-align: center;
    display: block;
    width: 100%;
    height: 100%;
    color: var(--color-on-surface);
}

.nav-link-name {
    display: block;
}

.nav-link-icon {
    display: none;
    font-size: 2em;
    //width: 100%;
}

@media (orientation: portrait), (max-aspect-ratio: 0.9) {
    //.nav-bg-overlay{
    //    display: block;
    //}

    .nav-link-name {
        display: none;
    }
    .nav-link-icon {
        display: block;
    }
    .navbar {
        top: unset;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: fit-content;
        border-radius: var(--border-radius);
        padding: var(--padding-md);
    }
    .nav-links {
        border-radius: var(--border-radius);
        backdrop-filter: blur(30px);
        background-color: var(--color-overlay-container);
    }
    .nav-link{
        padding: 0 var(--padding-md);

    }

}

</style>