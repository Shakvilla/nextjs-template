// import { getApiDocs } from '@/lib/swagger';
import { getApiDocs } from '@/(shared)/lib/swagger-utils';
import ReactSwagger from './react-swagger';

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
