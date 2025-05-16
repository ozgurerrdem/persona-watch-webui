import NewsCard from "../components/NewsCard";
import { useState } from "react";
import FilterBar from "../components/FilterBar";
import api from "../services/api";

export default function NewsFeed() {
    const [newsList, setNewsList] = useState<any[]>([]);

    const handleTestClick = () => {
        const dummyData = [
            {
                title: "Dummy Haber 1",
                content: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit odit sunt nam error quaerat eveniet totam illum explicabo? Voluptates qui quibusdam, ipsam omnis voluptas doloribus sunt dignissimos quaerat ex, autem debitis cum in expedita maxime harum hic recusandae assumenda similique. Eveniet itaque inventore asperiores aperiam unde, adipisci odit totam reiciendis odio ad hic. Tempora doloremque sunt, repudiandae ratione quas optio velit quae libero inventore numquam sint blanditiis exercitationem quaerat atque veniam odit cupiditate ab quis rerum. Voluptatem, repellat iusto delectus doloribus dignissimos, ipsam adipisci et, deleniti voluptates commodi quaerat labore nam. Doloremque hic quo pariatur adipisci praesentium sequi dicta magni consequatur, ipsam vitae eligendi, in corrupti consectetur, sunt ea nostrum voluptate enim animi vero eos commodi quasi! Incidunt tempore est ex fugiat in, earum aperiam maiores ipsum, aliquam facilis asperiores adipisci cum dolorum ipsa doloribus dolorem. Eius provident hic saepe voluptatem neque aliquam, et consequuntur, tempora est dolores maiores. Autem eveniet nisi consectetur sequi enim? Eum quasi, fuga iusto sit at, modi labore eveniet alias cum veritatis eligendi vero provident deserunt eaque libero accusantium possimus est exercitationem. Dolorem, omnis tempora ab numquam suscipit, doloremque sed soluta blanditiis, ea beatae quia! Minima nobis, natus ipsa doloribus dolor pariatur quisquam. Accusantium ex eum et optio assumenda temporibus fuga rem, neque vero magnam dignissimos totam voluptatum corrupti quod atque laborum sed cumque dolor odit perferendis impedit? Assumenda corrupti provident earum ratione nostrum beatae facilis incidunt ducimus rem dignissimos, odio atque, vitae, eveniet ullam debitis? Natus cupiditate cumque, voluptate eum ipsum blanditiis nulla nisi harum placeat rerum corporis asperiores dignissimos ex dolore vel velit dolorem iure laborum aliquam nostrum sequi veritatis facere tempora? Ullam nihil, rem nostrum doloremque eligendi debitis asperiores tempora consequuntur doloribus est dolorem eaque assumenda fuga? Neque, quod expedita assumenda inventore alias ut quasi placeat, nobis nam facere, pariatur molestiae similique et consectetur eveniet quibusdam porro rem. Sit id nam temporibus officia, quia et non explicabo assumenda, praesentium nostrum possimus cupiditate? Ad rem recusandae corrupti molestiae ex autem quas error? Reiciendis quasi fugiat illum adipisci laborum harum, minima illo! Placeat incidunt sit repellat sint similique. Exercitationem ipsam eligendi aut sapiente, quis hic aperiam repellendus dicta odit commodi dolor accusantium fugiat, praesentium, iusto deleniti. Eaque accusantium, consectetur minus autem earum ratione ullam quia a nam dolorum eum nulla delectus temporibus, corporis, quaerat saepe exercitationem quod id ea provident aperiam dolore veniam voluptates! Dicta dolor illo est laudantium ut! Accusamus laudantium, nihil adipisci corporis ratione delectus, dignissimos provident obcaecati, qui quisquam excepturi sunt cumque quas consequuntur ipsum! Repudiandae amet culpa impedit provident obcaecati non natus nobis illum. Aperiam facere omnis distinctio, ipsa illo consequatur cum sequi iure nulla explicabo tenetur earum fugiat id atque eum ullam? Dolor fugiat magni voluptates quidem rem quod, facilis sint quam sapiente enim dolorum esse at cum? Ex itaque sequi aut rerum unde in nulla maxime illum voluptatum. Officiis, cum numquam deleniti perferendis excepturi soluta aliquam blanditiis laboriosam libero quae praesentium harum magni odit perspiciatis expedita alias temporibus earum architecto et repellat fugiat nisi eligendi inventore ullam! Odit.",
                link: "https://www.example.com",
                platform: "Haber Sitesi",
            },
            {
                title: "Twitter Yorumu",
                content: "Bu kısa bir yorumdur.",
                link: "https://twitter.com",
                platform: "Twitter",
            },
            {
                title: "Dummy Haber 1",
                content: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit odit sunt nam error quaerat eveniet totam illum explicabo? Voluptates qui quibusdam, ipsam omnis voluptas doloribus sunt dignissimos quaerat ex, autem debitis cum in expedita maxime harum hic recusandae assumenda similique. Eveniet itaque inventore asperiores aperiam unde, adipisci odit totam reiciendis odio ad hic. Tempora doloremque sunt, repudiandae ratione quas optio velit quae libero inventore numquam sint blanditiis exercitationem quaerat atque veniam odit cupiditate ab quis rerum. Voluptatem, repellat iusto delectus doloribus dignissimos, ipsam adipisci et, deleniti voluptates commodi quaerat labore nam. Doloremque hic quo pariatur adipisci praesentium sequi dicta magni consequatur, ipsam vitae eligendi, in corrupti consectetur, sunt ea nostrum voluptate enim animi vero eos commodi quasi! Incidunt tempore est ex fugiat in, earum aperiam maiores ipsum, aliquam facilis asperiores adipisci cum dolorum ipsa doloribus dolorem. Eius provident hic saepe voluptatem neque aliquam, et consequuntur, tempora est dolores maiores. Autem eveniet nisi consectetur sequi enim? Eum quasi, fuga iusto sit at, modi labore eveniet alias cum veritatis eligendi vero provident deserunt eaque libero accusantium possimus est exercitationem. Dolorem, omnis tempora ab numquam suscipit, doloremque sed soluta blanditiis, ea beatae quia! Minima nobis, natus ipsa doloribus dolor pariatur quisquam. Accusantium ex eum et optio assumenda temporibus fuga rem, neque vero magnam dignissimos totam voluptatum corrupti quod atque laborum sed cumque dolor odit perferendis impedit? Assumenda corrupti provident earum ratione nostrum beatae facilis incidunt ducimus rem dignissimos, odio atque, vitae, eveniet ullam debitis? Natus cupiditate cumque, voluptate eum ipsum blanditiis nulla nisi harum placeat rerum corporis asperiores dignissimos ex dolore vel velit dolorem iure laborum aliquam nostrum sequi veritatis facere tempora? Ullam nihil, rem nostrum doloremque eligendi debitis asperiores tempora consequuntur doloribus est dolorem eaque assumenda fuga? Neque, quod expedita assumenda inventore alias ut quasi placeat, nobis nam facere, pariatur molestiae similique et consectetur eveniet quibusdam porro rem. Sit id nam temporibus officia, quia et non explicabo assumenda, praesentium nostrum possimus cupiditate? Ad rem recusandae corrupti molestiae ex autem quas error? Reiciendis quasi fugiat illum adipisci laborum harum, minima illo! Placeat incidunt sit repellat sint similique. Exercitationem ipsam eligendi aut sapiente, quis hic aperiam repellendus dicta odit commodi dolor accusantium fugiat, praesentium, iusto deleniti. Eaque accusantium, consectetur minus autem earum ratione ullam quia a nam dolorum eum nulla delectus temporibus, corporis, quaerat saepe exercitationem quod id ea provident aperiam dolore veniam voluptates! Dicta dolor illo est laudantium ut! Accusamus laudantium, nihil adipisci corporis ratione delectus, dignissimos provident obcaecati, qui quisquam excepturi sunt cumque quas consequuntur ipsum! Repudiandae amet culpa impedit provident obcaecati non natus nobis illum. Aperiam facere omnis distinctio, ipsa illo consequatur cum sequi iure nulla explicabo tenetur earum fugiat id atque eum ullam? Dolor fugiat magni voluptates quidem rem quod, facilis sint quam sapiente enim dolorum esse at cum? Ex itaque sequi aut rerum unde in nulla maxime illum voluptatum. Officiis, cum numquam deleniti perferendis excepturi soluta aliquam blanditiis laboriosam libero quae praesentium harum magni odit perspiciatis expedita alias temporibus earum architecto et repellat fugiat nisi eligendi inventore ullam! Odit.",
                link: "https://www.example.com",
                platform: "Haber Sitesi",
            },
            {
                title: "Twitter Yorumu",
                content: "Bu kısa bir yorumdur.",
                link: "https://twitter.com",
                platform: "Twitter",
            },
            {
                title: "Dummy Haber 1",
                content: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit odit sunt nam error quaerat eveniet totam illum explicabo? Voluptates qui quibusdam, ipsam omnis voluptas doloribus sunt dignissimos quaerat ex, autem debitis cum in expedita maxime harum hic recusandae assumenda similique. Eveniet itaque inventore asperiores aperiam unde, adipisci odit totam reiciendis odio ad hic. Tempora doloremque sunt, repudiandae ratione quas optio velit quae libero inventore numquam sint blanditiis exercitationem quaerat atque veniam odit cupiditate ab quis rerum. Voluptatem, repellat iusto delectus doloribus dignissimos, ipsam adipisci et, deleniti voluptates commodi quaerat labore nam. Doloremque hic quo pariatur adipisci praesentium sequi dicta magni consequatur, ipsam vitae eligendi, in corrupti consectetur, sunt ea nostrum voluptate enim animi vero eos commodi quasi! Incidunt tempore est ex fugiat in, earum aperiam maiores ipsum, aliquam facilis asperiores adipisci cum dolorum ipsa doloribus dolorem. Eius provident hic saepe voluptatem neque aliquam, et consequuntur, tempora est dolores maiores. Autem eveniet nisi consectetur sequi enim? Eum quasi, fuga iusto sit at, modi labore eveniet alias cum veritatis eligendi vero provident deserunt eaque libero accusantium possimus est exercitationem. Dolorem, omnis tempora ab numquam suscipit, doloremque sed soluta blanditiis, ea beatae quia! Minima nobis, natus ipsa doloribus dolor pariatur quisquam. Accusantium ex eum et optio assumenda temporibus fuga rem, neque vero magnam dignissimos totam voluptatum corrupti quod atque laborum sed cumque dolor odit perferendis impedit? Assumenda corrupti provident earum ratione nostrum beatae facilis incidunt ducimus rem dignissimos, odio atque, vitae, eveniet ullam debitis? Natus cupiditate cumque, voluptate eum ipsum blanditiis nulla nisi harum placeat rerum corporis asperiores dignissimos ex dolore vel velit dolorem iure laborum aliquam nostrum sequi veritatis facere tempora? Ullam nihil, rem nostrum doloremque eligendi debitis asperiores tempora consequuntur doloribus est dolorem eaque assumenda fuga? Neque, quod expedita assumenda inventore alias ut quasi placeat, nobis nam facere, pariatur molestiae similique et consectetur eveniet quibusdam porro rem. Sit id nam temporibus officia, quia et non explicabo assumenda, praesentium nostrum possimus cupiditate? Ad rem recusandae corrupti molestiae ex autem quas error? Reiciendis quasi fugiat illum adipisci laborum harum, minima illo! Placeat incidunt sit repellat sint similique. Exercitationem ipsam eligendi aut sapiente, quis hic aperiam repellendus dicta odit commodi dolor accusantium fugiat, praesentium, iusto deleniti. Eaque accusantium, consectetur minus autem earum ratione ullam quia a nam dolorum eum nulla delectus temporibus, corporis, quaerat saepe exercitationem quod id ea provident aperiam dolore veniam voluptates! Dicta dolor illo est laudantium ut! Accusamus laudantium, nihil adipisci corporis ratione delectus, dignissimos provident obcaecati, qui quisquam excepturi sunt cumque quas consequuntur ipsum! Repudiandae amet culpa impedit provident obcaecati non natus nobis illum. Aperiam facere omnis distinctio, ipsa illo consequatur cum sequi iure nulla explicabo tenetur earum fugiat id atque eum ullam? Dolor fugiat magni voluptates quidem rem quod, facilis sint quam sapiente enim dolorum esse at cum? Ex itaque sequi aut rerum unde in nulla maxime illum voluptatum. Officiis, cum numquam deleniti perferendis excepturi soluta aliquam blanditiis laboriosam libero quae praesentium harum magni odit perspiciatis expedita alias temporibus earum architecto et repellat fugiat nisi eligendi inventore ullam! Odit.",
                link: "https://www.example.com",
                platform: "Haber Sitesi",
            },
            {
                title: "Twitter Yorumu",
                content: "Bu kısa bir yorumdur.",
                link: "https://twitter.com",
                platform: "Twitter",
            },
        ];
        setNewsList(dummyData);
    };

    const handleFilter = async (searchValue: string) => {
        console.log("Arama yapılıyor:", searchValue);
        try {
            const response = await api.get(`/news`, {
                params: { search: searchValue }
            });
            setNewsList(response.data);
        } catch (error) {
            console.error("Veri alınamadı", error);
        }
    };

    const handleAutoRefresh = () => {
        console.log("Sunucudan veri çekiliyor...");
    };

    const uniquePlatforms = Array.from(new Set(newsList.map((item) => item.platform)));

    return (
        <>
            <FilterBar
                platformOptions={uniquePlatforms}
                onFilter={handleFilter}
                onTestData={handleTestClick}
                onRefresh={handleAutoRefresh}  // Buraya API yenileme fonksiyonunu bağlarsın
            />

            <div className="flex flex-col">
                {newsList.map((item, index) => (
                    <NewsCard key={index} {...item} />
                ))}
            </div>
        </>
    );
}
