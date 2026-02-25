import Image from "next/image"
import Link from "next/link"
import { Heart, Award, Users, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Commerce에 대해</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            홈
          </Link>
          <span className="mx-2">/</span>
          <span>소개</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">우리의 이야기</h2>
          <p className="text-muted-foreground mb-4">
            2015년에 설립된 Commerce는 펫친구들을 위한 고품질 상품을 제공하고 반려동물 생활을 더욱 쉽고 즐겁게 만들려는 단순한 미션으로 시작했습니다.
          </p>
          <p className="text-muted-foreground mb-4">
            작은 지역 가게로 시작한 Commerce는 이제 전국의 반려동물 애호가들이 신뢰하는 온라인 쇼핑몰로 성장했습니다. 저희 창업자인 김민지는 열정적인 반려견 보호자로서 품질과 저렴함을 모두 갖춘 프리미엄 반려동물 상품의 필요성을 인식했습니다.
          </p>
          <p className="text-muted-foreground">
            오늘날 우리는 동물에 대한 사랑과 탁월한 고객 서비스에 대한 약속으로 계속 나아가고 있습니다. 저희 카탈로그의 모든 상품은 품질, 안전 및 가치에 대한 높은 기준을 충족하도록 신중하게 선택되었습니다.
          </p>
        </div>
        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3"
            alt="Commerce 팀과 강아지들"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">우리의 가치</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Commerce의 핵심 가치는 상품 선택부터 고객 서비스까지 우리가 하는 모든 일을 이끕니다.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg border p-6 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">반려동물 웰빙</h3>
            <p className="text-muted-foreground">
              우리는 반려동물의 건강, 행복 및 웰빙에 기여하는 상품을 우선시합니다.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">품질 보증</h3>
            <p className="text-muted-foreground">
              우리는 모든 상품을 엄격하게 테스트하고 검증하여 높은 품질 및 안전 기준을 충족하는지 확인합니다.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">고객 중심</h3>
            <p className="text-muted-foreground">
              우리는 뛰어난 서비스를 제공하고 고객과의 지속적인 관계를 구축하는 데 전념합니다.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">신뢰성</h3>
            <p className="text-muted-foreground">
              우리는 빠른 배송, 정확한 주문 및 신속한 고객 지원으로 우리의 약속을 이행합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">우리 팀을 소개합니다</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Commerce 뒤에서 최고의 상품을 여러분과 반려동물에게 제공하기 위해 열심히 일하는 열정적인 사람들입니다.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "김민지",
              role: "창립자 & CEO",
              image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
            },
            {
              name: "이준호",
              role: "제품 담당자",
              image:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
            },
            {
              name: "박지은",
              role: "고객 경험",
              image:
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3",
            },
            {
              name: "최동욱",
              role: "물류 관리자",
              image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
            },
          ].map((member, index) => (
            <div key={index} className="bg-card rounded-lg border overflow-hidden">
              <div className="relative h-64 w-full">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Commerce 가족에 참여하세요</h2>
        <p className="max-w-2xl mx-auto mb-6">
          반려견을 위한 프리미엄 상품을 발견하고 Commerce를 신뢰하는 수천 명의 만족한 반려견 보호자의 일원이 되세요.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/shop">지금 쇼핑하기</Link>
        </Button>
      </div>
    </div>
  )
}
