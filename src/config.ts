export const SITE = {
  website: "https://blog.lhasa.icu/", // replace this with your deployed domain
  author: "游钓四方",
  profile: "https://satnaing.dev/",
  desc: "千禧年小孩，长途骑行小学生、野钓路亚、振出并继、古典乐、茶叶爱好者",
  title: "游钓四方",
  ogImage: "https://cos.lhasa.icu/StylePictures/my-photo.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  lang: "zh-CN", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Bangkok", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
