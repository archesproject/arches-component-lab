/// <reference types="vite/client" />
type Loader = () => Promise<unknown>;
type Registry = Record<string, Loader>;

type ModuleWithDefault<T> = { default: T } & Record<string, unknown>;
const getDefault = <T>(m: unknown): T =>
    typeof m === "object" && m !== null && "default" in (m as object)
        ? (m as ModuleWithDefault<T>).default
        : (m as T);

/** Normalize keys to "@/arches_component_lab/..." */
function toAliasKey(input: string): string {
    if (input.startsWith("@/arches_component_lab/")) return input;

    // Vite absolute keys: ".../src/arches_component_lab/widgets/Foo/Foo.vue"
    const marker = "/src/arches_component_lab/";
    const pos = input.lastIndexOf(marker);
    if (pos !== -1) return "@/" + input.slice(pos + "src/".length);

    // Webpack ctx keys: "./widgets/Foo/Foo.vue"
    if (input.startsWith("./")) {
        return input.replace(/^\.\/(.*)$/, "@/arches_component_lab/$1");
    }
    return input;
}

function buildViteRegistry(): Registry {
    try {
        const raw = import.meta.glob(
            "@/arches_component_lab/widgets/**/*.{vue,ts}",
            { eager: false },
        ) as Record<string, Loader>;

        return Object.fromEntries(
            Object.entries(raw).map(
                ([k, loader]) => [toAliasKey(k), loader] as const,
            ),
        );
    } catch {
        return {};
    }
}

export async function loadWidget<T>(updatedComponentPath: string): Promise<T> {
    const key = `@/${updatedComponentPath}.vue`;
    const reg = buildViteRegistry();

    let loader = reg[key];
    if (!loader) {
        const m = Object.entries(reg).find(([k]) =>
            k.endsWith(`/${updatedComponentPath}.vue`),
        );
        if (m) loader = m[1];
    }
    if (!loader) throw new Error(`Vite registry cannot find: ${key}`);

    const mod = await loader();
    return getDefault<T>(mod);
}
