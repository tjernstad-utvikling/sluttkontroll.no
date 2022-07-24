import { Checklist } from '../../../contracts/kontrollApi';
import { categories } from '../../../utils/checkpointCategories.json';

export function sortChecklist(checklists: Checklist[]) {
    const grouped = groupBy(checklists, 'mainCategory');
    const groupedByGroupCategory = [];

    for (const [key, value] of Object.entries(grouped)) {
        const res = groupBy(value, 'groupCategory');
        const mainCategory = categories.find((c) => c.key === key);

        for (const [gKey, value] of Object.entries(res)) {
            const groupCategory = mainCategory?.groups.find(
                (g) => g.key === Number(gKey)
            );
            groupedByGroupCategory.push({
                title: groupCategory?.name ?? gKey,
                data: value.sort(function (a, b) {
                    return (
                        a.checkpoint.checkpointNumber -
                        b.checkpoint.checkpointNumber
                    );
                })
            });
        }
    }

    return groupedByGroupCategory;
}

function groupBy(
    objectArray: Checklist[],
    property: 'mainCategory' | 'groupCategory'
) {
    return objectArray.reduce(function (
        acc: {
            [key: string | number]: Checklist[];
        },
        obj
    ) {
        const key = obj.checkpoint[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}
