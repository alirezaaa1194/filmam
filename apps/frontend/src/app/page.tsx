import { Metadata } from "next";
import Test from "../features/test.index";
import { GetTranslation } from "../scripts/server/translation";
import Image from "next/image";
import pic from "@/assets/images/Image.png";
export async function generateMetadata() {
  const { t } = await GetTranslation();

  return {
    title: t("Layout.title"),
  };
}

export default async function HomePage() {
  const { t } = await GetTranslation();

  return (
    <div>
      <Image src={pic} alt="test" />
      {/* Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi eius corrupti mollitia quisquam odio quis? Laudantium, est nulla. Consectetur consequuntur obcaecati explicabo, officiis magnam quisquam odit accusantium, neque voluptatibus, velit accusamus inventore mollitia exercitationem dolore similique sequi. Sequi deleniti molestiae beatae delectus distinctio at odit magni, recusandae placeat quidem laborum?
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi eius corrupti mollitia quisquam odio quis? Laudantium, est nulla. Consectetur consequuntur obcaecati explicabo, officiis magnam quisquam odit accusantium, neque voluptatibus, velit accusamus inventore mollitia exercitationem dolore similique sequi. Sequi deleniti molestiae beatae delectus distinctio at odit magni, recusandae placeat quidem laborum?
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi eius corrupti mollitia quisquam odio quis? Laudantium, est nulla. Consectetur consequuntur obcaecati explicabo, officiis magnam quisquam odit accusantium, neque voluptatibus, velit accusamus inventore mollitia exercitationem dolore similique sequi. Sequi deleniti molestiae beatae delectus distinctio at odit magni, recusandae placeat quidem laborum?
      {t("Layout.description")}
      <br />
      <Test /> */}
    </div>
  );
}
