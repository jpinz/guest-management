<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { Prototype } from '@inkline/inkline';

export default defineComponent({
    props: {
        type: {
            type: String,
            default: 'default'
        },
        transparent: {
            type: Boolean,
            default: true
        }
    },
    setup () {
        const inkline = inject<Prototype>('inkline', {} as any);
        const colorMode = ref(inkline.options.colorMode);

        if (colorMode.value === 'system' && typeof window !== 'undefined') {
            colorMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        const setColorMode = () => {
            const mode = colorMode.value === 'dark' ? 'light' : 'dark';

            inkline.options.colorMode = mode;
            colorMode.value = mode;
        };

        return {
            colorMode,
            setColorMode,
        };
    }
});
</script>

<template>
    <i-navbar :collapse="false">
        <i-navbar-brand to="/" translate="no">
            <span>Social</span>
        </i-navbar-brand>
        <i-navbar-collapsible class="_justify-content:end">
            <i-nav>
                <!-- <i-nav-item v-if="type === 'docs'" id="navbar-item-docsearch">
                    <docsearch />
                </i-nav-item>
                <i-nav-item v-if="type === 'default'" id="navbar-item-documentation" :to="{ path: '/docs/introduction' }">
                    <span>{{ t('navbar.docs') }}</span>
                    <span>{{ t('navbar.documentation') }}</span>
                </i-nav-item> -->
                <i-nav-item @click="setColorMode">
                    <icon-fa-solid-sun v-if="colorMode === 'dark'" />
                    <icon-fa-solid-moon v-else />
                    <span class="_visually-hidden">
                        <span>Color Mode</span>
                    </span>
                </i-nav-item>
                <i-nav-item href="https://github.com/jpinz" rel="noopener">
                    <icon-fa-brands-github />
                    <span class="_visually-hidden">
                        GitHub
                    </span>
                </i-nav-item>
                <slot />
            </i-nav>
        </i-navbar-collapsible>
    </i-navbar>
</template>